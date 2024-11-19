import { Request, Response } from 'express';
import { Thought, Reaction, User } from '../models/indexModels.js'


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
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: thought._id } },
            {new: true},
        );

        if (!user) {
            res.status(404).json({
                message: 'Thought Created, but found no User with that ID',
            })
        }
        res.json('Created Thought');
        
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

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
        res.json(thought);
        
    } catch (err) {
        res.status(500).json(err);
    }
};

export const deleteThought = async (req: Request, res: Response) => {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
  
      if (!thought) {
        res.status(404).json({ message: 'No Thought Found'})
      } 
        const user = await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.applicationId } },
            { new: true }
        );

        if (!user) {
            res.status(404).json({
                message: 'No User Found with this ID',
            });
        }
        
        res.json({ message: 'Thought deleted successfully' });
        return;
    } catch (err) {
      res.status(500).json(err);
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
            res
                .status(404)
                .json({ message: 'No Thought found with that ID' })
        }

        res.json(thought);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
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
            res
                .status(404)
                .json({ message: 'No Thought found with that ID' });
        }

        res.json(thought);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}
