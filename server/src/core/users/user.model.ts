import { Schema, model, models, Document } from "mongoose";

/**
 * গুরুত্বপূর্ণ নোট:
 * Better Auth নিজেই MongoDB তে "user", "session", "account", "verification"
 * কালেকশন তৈরি ও ম্যানেজ করে (mongodbAdapter এর মাধ্যমে)। আমরা সেই কালেকশনকে
 * ছুঁবো না বা override করবো না।
 *
 * আমাদের অ্যাপের এক্সট্রা ফিল্ড (subscribedModules, bio, ইত্যাদি) রাখার জন্য
 * এই আলাদা "UserProfile" মডেল, যেটা better-auth এর userId দিয়ে লিংকড।
 * প্রতিটা নতুন ইউজার রেজিস্টার হওয়ার পর (auth hook দিয়ে, Phase 3 এ যোগ হবে)
 * একটা UserProfile ডকুমেন্ট অটো-তৈরি হবে।
 */

export interface IUserProfile extends Document {
  userId: string; // better-auth এর user._id (string হিসেবে রেফারেন্স)
  subscribedModules: string[]; // যেমন: ["content-generator"]
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    subscribedModules: {
      type: [String],
      default: ["content-generator"],
    },
    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },
  },
  { timestamps: true, collection: "userprofiles" }
);

export const UserProfile =
  models.UserProfile || model<IUserProfile>("UserProfile", userProfileSchema);
