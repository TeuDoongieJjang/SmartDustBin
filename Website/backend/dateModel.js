import mongoose from "mongoose";

const trashDateSchema = mongoose.Schema({
  recycleable: {
    type: [String]
  },
  nonBio: {
    type: [String]
  }
});

const TrashDate = mongoose.model("TrashDate", trashDateSchema);

export default TrashDate;
