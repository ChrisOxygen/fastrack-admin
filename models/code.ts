import { Model, Schema, model, Document, models } from "mongoose";

export type CodeT = {
  adminCode: string;
};

export type CodeMethods = CodeT & Document;

export type CodeModel = Model<CodeMethods>;

// const codeSchema: Schema<CodeMethods>

const codeSchema: Schema<CodeMethods> = new Schema(
  {
    adminCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Code = models?.Code || model<CodeMethods, CodeModel>("Code", codeSchema);

export default Code;
