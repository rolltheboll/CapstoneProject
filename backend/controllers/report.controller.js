const Report = require('../models/Report');

exports.createReport = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can report listings.' });
    }

    const { listingId, reason } = req.body;

    const report = new Report({
      listing: listingId,
      student: req.user.id,
      reason
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to submit report' });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('listing', 'title location')
      .populate('student', 'name email');

    res.status(200).json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Report deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to delete report' });
  }
};
