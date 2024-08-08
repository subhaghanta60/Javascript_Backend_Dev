import { response } from "express";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

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

       const existedUser = User.findOne({
                $or: [{ username }, { email }]
        })
        if(existedUser) {
            throw new ApiError(409, "User with email or username Already Exited")
        }

        // Check for images,check for avator

        const avatarLocalPath = req.files?.avatar[0].path;
        const coverImageLocalPath = req.files?.coverImage[0].path;

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

        if(createdUser){
            throw new ApiError(500, "Something Went Wrong While register the User")
        }
        console.log(createdUser);
        // return Response

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User Registed succesfully")
        )





})

export {registerUser}