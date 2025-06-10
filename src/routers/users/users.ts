import { Router } from "express";
import { createUsers, loginUser, forgetPassword, resetPassword, addWatchlist, getWatchlist, deleteWatchlist } from "../../controllers/users/users";

const userRouter = Router();

userRouter.post('/register', createUsers);  
userRouter.post('/login', loginUser);   
userRouter.post('/forget-password', forgetPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/add-watchlist', addWatchlist);
userRouter.post('/get-watchlist', getWatchlist);
userRouter.delete('/delete-watchlist', deleteWatchlist);


export default userRouter;
