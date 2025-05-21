use('youth_policies')
//db.seoul_policies.deleteMany({})

//db.getCollectionNames()
//db.seoul_policies.countDocuments()
//db.seoul_policies.findOne()
//db.seoul_policies.countDocuments({ "rgtrInstCdNm": /서울/ })
//db.processed_policies.aggregate([{ $sample: { size: 1 } }])

//db.seoul_policies.findOne({ plcyNo: "20240521005400200021" })

db.processed_policies.deleteMany({})