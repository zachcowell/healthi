var geotempCount = db.geotemp.find().count();
var inspectionCount = db.inspections.find().count();
print('Number of items in geotemp: ' + geotempCount);
print('Number of items in inspection: ' + inspectionCount);
db.geotemp.remove();
db.geotemp.drop();