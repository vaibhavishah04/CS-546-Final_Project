import { ObjectId } from "mongodb"

const valid_obj_id = (id) => {
  if (ObjectId.isValid(id)) {
    if ((String)(ObjectId.createFromHexString(id)) === id) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const valid_sensor_number = (sensor_number) => {
    if (typeof sensor_number === 'number' && sensor_number >= 1){
        return true;
    } else {
        return false;
    }
    }

const valid_string = (s) => {
    if (typeof s === 'string' && s.trim().length > 0) {
        return true;
    } else {
        return false;
    }
}

const valid_coords = (coords) => {
    coords = coords.split(",")
    coords = coords.map(coord => parseFloat(coord.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        return true;
    } else {
        return false;
    }
};

const valid_status = (status) => {
    const valid_statuses = ['active', 'inactive', 'maintenance'];
    return valid_statuses.includes(status);
};

const valid_timestamp = (ts) => {
    if (typeof ts !== 'string'){
        return false
    }
    ts = ts.split("-")
    if (ts.length !== 4){
         return false
    }
    var date = ts[2]+"-"+ts[1]+"-"+ts[0]+"T"+ts[3]
    try{
        var timestamp = new Date(date)
    } catch (err) {
        return false
    }
    return timestamp instanceof Date && !isNaN(timestamp) && timestamp.getTime() > 0
}

const valid_measurements = (measurements) => {
     if (Array.isArray(measurements)) {
        return measurements.every(measurement => { if (typeof measurement === 'string'){ return valid_timestamp(measurement); } else { if (typeof measurement === 'number' && !isNaN(measurement)) { return true; } else { return false; } }});
    } else {
        return false;
    }
}

const valid_notes = (notes) => {
    /**
     * TODO
     */
     return true
} 

const valid_impath = (imgpath) => {
    if (typeof imgpath === 'string' && imgpath.trim().length > 0) {
        return true;
    } else {
        return false
    }
}


const toExport = {
     valid_obj_id,
     valid_sensor_number,
     valid_string,
     valid_coords,
     valid_status,
     valid_timestamp,
     valid_measurements,
     valid_notes,
     valid_impath
}

export default toExport;