import { Schema, Types, model, type Document } from 'mongoose';

interface IFriend extends Document {
    friendId: Schema.Types.ObjectId,
    username: string;
}

interface IUser extends Document {
    username: string;
    email: string;
    thoughts?: Schema.Types.ObjectId[]
    friends?: Schema.Types.ObjectId[]
}

const friendSchema = new Schema<IFriend>(
        {
            friendId: {
                type: Schema.Types.ObjectId,
                default: () => new Types.ObjectId(),
            },
            username: {
                type: String,
                required: true
            },
        },
        { timestamps: true }
    );


const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i, "lease enter a valid email"]
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought'
            },
        ],
        friends: [friendSchema]
    },
    {
        toJSON: {
            virtuals: true,
        },
    }
);

userSchema
    .virtual('friendCount')
    .get(function (this: IUser) {
        return this.friends?.length
    })

const User = model<IUser>('User', userSchema);

export default User
