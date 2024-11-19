import { Request, Response } from 'express';
import { Thought, User } from '../models/indexModels.js'

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate([{ path: 'thoughts', select: '-__v '}, {path: 'friends', select: '-__v'}]);
        
        if (user) {                
            res.json(user);
        } else {
            res.status(404).json({
                message: 'User not found'
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId},
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!user) {
            res.status(404).json({ message: 'No user with that ID! '})
        }

        res.json(user)
    } catch (error: any) {
        res.status(400).json({ 
            message: error.message
        })
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });

        if (!user) {
            res.status(404).json({
                message: 'There is no user with that ID'
            });
        } else {
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and Thoughts deleted successfully' });
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const addFriend = async (req: Request, res: Response ) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body } },
            { runValidators: true, new: true }
        );

        if (!user) {
            res
                .status(404)
                .json({ message: 'No user found with that ID' })
        }

        res.json(user);
    } catch (err) {
        res.status(500).json(err)
    }
}

export const unFriend = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: { friendId: req.params.friendId } } },
            { runValidators: true, new: true }
        );

        if (!user) {
            res
                .status(404)
                .json({ message: 'No user found with that ID' });
        }

        res.json(user)
    } catch (err) {
        res.status(500).json(err);
    }
}
