use('youth_policies')
//db.seoul_policies.deleteMany({})

//db.getCollectionNames()
//db.seoul_policies.countDocuments()
// db.seoul_policies.findOne()
//db.seoul_policies.aggregate([{ $sample: { size: 3 } }])

//db.seoul_policies.countDocuments({ "rgtrInstCdNm": /서울/ })
//db.processed_policies.aggregate([{ $sample: { size: 3 } }])

// db.seoul_policies.findOne({ plcyNo: "20240627005400200004" })
db.metadata_store.findOne({ plcyNo: "20240627005400200004" })

// db.processed_policies.deleteMany({})
//db.processed_policies_curated.aggregate([{ $sample: { size: 3 } }])

// db.metadata_store.aggregate([{ $sample: { size: 3 } }])
// db.metadata_store.deleteMany({})