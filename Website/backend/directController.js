import TrashDate from "./dateModel.js";

export const addDate = async (req, res) => {
  try {

    const { bin } = req.params;

    const now = new Date();

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      ...options,
    }).format(now);

    let recycleableDate = await TrashDate.findOne();

    let nonBioDate = await TrashDate.findOne();

    if (!recycleableDate && bin == 1){
      recycleableDate = new TrashDate({
        recycleable: formattedDate
      })
      await recycleableDate.save();
    } else if (!nonBioDate && bin == 2){
      nonBioDate = new TrashDate({
        nonBio: formattedDate
      })
      await nonBioDate.save();
    } else  if (recycleableDate && bin == 1){
      recycleableDate.recycleable.push(formattedDate);
      await recycleableDate.save();
    } else if (nonBioDate && bin == 2){
      nonBioDate.nonBio.push(formattedDate);
      await nonBioDate.save();
    }

    return res.status(200).json({
      message: `Successfully Added Time`,
    });
  } catch (error) {
    return res.status(400).json({ error: `Error in Add Date Controller error` });
  }
};

export const home = async (req, res) => {
  try {
    let dateTime = await TrashDate.findOne();
    return res.status(200).json({
      dateTimeRecycleable: dateTime.recycleable,
      dateTimeNonBio: dateTime.nonBio,
    });
  } catch (error) {
    return res.status(400).json({ error: `Error in View Controller ${error}` });
  }
};

export const homeEdit = async (req, res) => {
  try {
    const { del } = req.params;

    let dateTime = await TrashDate.findOne();

    if (del == "rec") {
      await dateTime.updateOne({ $unset: { recycleable: "" } });
    } 

    if (del == "non") {
      await dateTime.updateOne({ $unset: { nonBio: "" } });
    }

    return res.status(200).json({
      message: "Successfully Reset Time",
    });

  } catch (error) {
    return res.status(400).json({ error: `Error in Home Edit: ${error}` });
  }
}

export const dateEdit = async (req, res) => {
  try {
    const { date, field } = req.params; 
    const indexToRemove = parseInt(date);

    let dateTime = await TrashDate.findOne();
 
    await dateTime.updateOne({
      [`${field}.${indexToRemove}`]: null
    });

    await dateTime.updateOne({
      $pull: { [field]: null }
    });

    return res.status(200).json({
      message: "Successfully Reset Time",
    });

  } catch (error) {
    return res.status(400).json({ error: `Error in Date Edit: ${error}` });
  }
}


