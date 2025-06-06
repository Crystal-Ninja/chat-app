import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const UseAuthStore=create((set)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    checkAuth:async () => {
        try {
            const res=await axiosInstance.get("/auth/check");
            set ({authUser:res.data});
        } catch (error) {
            console.log("error in checkAuth",error);
            set ({authUser:null});
        } finally{
            set({isCheckingAuth:false});
        }
    },

    signup:async (data) => {
        set({isSigningUp:true});
        try {
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account Created Successfully");
        } catch (error) {
            const errorMessage =error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
        }finally{
            set({isSigningUp:false});
        };
    }
}))