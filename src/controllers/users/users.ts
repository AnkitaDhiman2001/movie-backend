import { Request, Response } from "express";
import Users from "../../models/users";
import bcrypt from "bcrypt";
import { sendResetPasswordEmail } from "../../helpers/emailSender";
import Watchlists from "../../models/watchList";

export const createUsers = async (req: Request, res: Response) => {
    try {
        const users = await Users.create({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });
        res.status(201).json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to create user", error: err });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const getUser = await Users.findOne({ where: { email } });
        if (!getUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, getUser.dataValues.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: getUser.dataValues.id,
                email: getUser.dataValues.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Login error", error: err });
    }
};

export const forgetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        sendResetPasswordEmail(email); 
        
        res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (err) {
        res.status(500).json({ message: "Error in forget password", error: err });
    }
}
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, newPassword } = req.body;
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await Users.update({ password: hashedPassword }, { where: { email } });
        res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error in reset password", error: err });
    }
};


export const addWatchlist = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const addedType = await Watchlists.create({
            userId: data.userId,
            mediaId: data.movieId,
            mediaType: data.mediaType,
            mediaTitle: data.mediaTitle,
            mediaPoster: data.mediaPoster
        });
        if (!addedType) {
            return res.status(400).json({ message: "Failed to add to watchlist" });
        }
        res.status(201).json({ message: "Added to watchlist", data: addedType });
    }
    catch (err){
        res.status(500).json({ message: "Error adding to watchlist", error: err });
    }
}

export const getWatchlist = async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;
        const watchlist = await Watchlists.findAll({ where: { userId } });
        if (!watchlist) {
            return res.status(404).json({ message: "Watchlist not found" });
        }
        res.status(200).json(watchlist);
    } catch (err) {
        res.status(500).json({ message: "Error fetching watchlist", error: err });
    }
};

export const deleteWatchlist = async (req: Request, res: Response) => {
    try {
        const { userId, mediaId } = req.body;
        const deletedItem = await Watchlists.destroy({ where: { userId, mediaId } });
        if (!deletedItem) {
            return res.status(404).json({ message: "Watchlist item not found" });
        }
        res.status(200).json({ message: "Watchlist item deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting watchlist item", error: err });
    }
};

