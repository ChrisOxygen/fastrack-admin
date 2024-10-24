import { model, models, Schema } from "mongoose";

export interface ITransaction extends Document {
  transactionId: string;
  type: string;
  amount: number;
  status: string;
  fee: number;
  user: {
    _id: string;
  };
}

const transactionSchema = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Transaction =
  models.Transaction || model("Transaction", transactionSchema);

export default Transaction;
