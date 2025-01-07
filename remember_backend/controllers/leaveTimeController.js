
const leaveTime = require('../models/leaveTimeModel');

const getleaveTime = async (req, res) => {
  try {
    const { userid } = req.body
    const user_leaveTime = await leaveTime.find( {userid} );
    res.status(200).json({ success: true, user_leaveTime });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load user leave time', error });
  }
};

const addleaveTime = async (req, res) => {
  try {
    const { userId, time } = req.body;
    const user_leaveTime = new leaveTime({ userId, time });
    await user_leaveTime.save();
    res.status(201).json({ success: true, message: `You will leave your house at ${time}` });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Failed to add leave time', error });
  }
};

const putleaveTime = async (req, res) => {
  try {
    const { userId, time, _id } = req.body;
    const user_leaveTime = { 
      userId: userId, 
      time: time };
    console.log(user_leaveTime, _id)
    await leaveTime.findByIdAndUpdate(_id, user_leaveTime, {new:true, runValidators:true});
    res.status(204).json({ success: true, user_leaveTime })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Failed to update leave time', error})
  }
}

module.exports = { getleaveTime, addleaveTime, putleaveTime };