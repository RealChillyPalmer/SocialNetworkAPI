import { Request, Response } from 'express';
import Thought from '../models/Thought'
import Reactions from '../models/Thought'

export const getAllThoughts = async (_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
}

export const getThoughtById = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
        const thought = await Thought.findById(thoughtId);
        if (thought) {
            res.json(thought);
        } else {
            res.status(404).json({
                message: 'Thought Not Found'
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const createThought = async (req: Request, res: Response) => {
    try {
        const { thoughtText, username, reactions } = req.body;
        const newThought = await Thought.create({
            thoughtText,
            username,
            reactions
        });
        res.status(201).json(newThought);
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
};

export const updateThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );
        if (!thought) {
        res.status(404).json({ message: 'No Thought Found'})
        }
        res.json(thought)
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
};

export const deleteThought = async (req: Request, res: Response) => {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
  
      if (!thought) {
        res.status(404).json({
          message: 'No Course with that ID'
        });
      } else {
        await Reactions.deleteMany({ _id: { $in: thought.reactions } });
        res.json({ message: 'Thoughts abd Reactions Removed!' });
      }
  
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };
  
export const createReaction = async (req: Request, res: Response ) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No Thought found with that ID' })
        }

        return res.json(thought)
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const deleteReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No Thought found with that ID' });
        }

        return res.json(thought)
    } catch (err) {
        return res.status(500).json(err);
    }
}
