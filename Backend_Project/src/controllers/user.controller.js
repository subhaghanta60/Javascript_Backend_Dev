import { response } from "express";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async(userId) => {
        try {
            const user = await User.findById(userId);
            const acessToken = await user.generateAccessToken();
            const refreshToken = await user.generateRefreshToken();

            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            return {acessToken, refreshToken}

        } catch (error) {
            throw new ApiError(500,"Something Went Wrong while Generating Refresh and Access Token")
        }


}

const registerUser = asyncHandler( async (req,res) => {
    /*
    res.status(200).json({
        message: "Ok"
    })
     */
    // Get User Details From Frontend
    // Validation All Details - Not empty
    // Check if User Already Exits :username, email
    // Check for images,check for avator
    // Upload them to cloudinary,check for avatar
    // Create User Object - Create Entry in DB
    // Remove password and Refresh Token Field From Response
    // Check for User Creation
    // return Response

        //Step 1 : Get User Details From Frontend
        const {fullName,email,username,password} = req.body

        //Validation All Details - Not empty
            /*
            if(fullName === ""){
                throw new ApiError(400, "Full Name Is Required")
            }
            */

        if(
            [fullName,email,username,password].some( (field)=> field?.trim() === "" )
        ) {
            throw new ApiError(400, "All fields are Required")
        }
       // Check if User Already Exits :username, email

       const existedUser = await  User.findOne({
                $or: [{ username }, { email }]
        })
        if(existedUser) {
            throw new ApiError(409, "User with email or username Already Exited")
        }

        // Check for images,check for avator

        const avatarLocalPath = req.files?.avatar[0].path;
        //const coverImageLocalPath = req.files?.coverImage[0].path;

        let coverImageLocalPath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files?.coverImage[0].path;
        }

        if(!avatarLocalPath){
            throw new ApiError(400,"Avatar File Required")
        }

        // Upload them to cloudinary,check for avatar
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        if(!avatar){
            throw new ApiError(400,"Avatar File Required")
            
        }
        // Create User Object - Create Entry in DB

       const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage : coverImage?.url || "",
            email,
            username: username.toLowerCase(),
            password

        })

         // Check for User Creation
        const createdUser = await  User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500, "Something Went Wrong While register the User")
        }
        console.log(createdUser);
        // return Response

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User Registed succesfully")
        )

})

const loginUser = asyncHandler( async (req,res) => {
    //Get username,password From Frontend
   
    //find User by using Username or email
    //if find User then Encrypt password and validate with User Password
    // If User validatation Complete ,then User loggedin And Add Refresh Token
     // Acesstoken, Refresh Token Generate
     //send cookie and response

     const {email, username,password} = req.body

     if(!(username || email)){
        throw new ApiError(400, "Username or Password Is Required")
     }

     const user = await User.findOne(
        {
            $or: [{username},{email}]
        }
     )

     if(!user){
        throw new ApiError(404, "User Does not Exit")
     }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(401,"Invalid User Credential")
    }

    const {acessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = awaitUser.findById(user._id).seelct(" -password -refreshtoken ");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.statue(200)
    .cookie("accessToken",acessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .cookie("user",loggedInUser,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,acessToken,refreshToken
            },
            "User logged In Successfully"
        )
    )



})

const logoutUser = asyncHandler( async (req,res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                     refreshToken: undefined
                },
                {
                    new:true
                },
        },
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {}, "User Logged Out"))
   
    })

export {
    registerUser,
    loginUser,
    logoutUser
}