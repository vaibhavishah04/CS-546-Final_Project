import { ObjectId } from "mongodb";

const valid_obj_id = (id) => {
  if (ObjectId.isValid(id)) {
    if (String(ObjectId.createFromHexString(id)) === id) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const valid_sensor_number = (sensor_number) => {
  if (typeof sensor_number === "number" && sensor_number >= 1) {
    return true;
  } else {
    return false;
  }
};

const valid_string = (s) => {
  if (typeof s === "string" && s.trim().length > 0) {
    return true;
  } else {
    return false;
  }
};

const valid_coords = (coords) => {
  coords = coords.split(",");
  coords = coords.map((coord) => parseFloat(coord.trim()));
  if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
    return true;
  } else {
    return false;
  }
};

const valid_status = (status) => {
  const valid_statuses = ["active", "inactive", "maintenance"];
  return valid_statuses.includes(status);
};

const valid_timestamp = (ts) => {
  if (typeof ts !== "string") {
    return false;
  }
  ts = ts.split("-");
  if (ts.length !== 4) {
    return false;
  }
  var date = ts[2] + "-" + ts[1] + "-" + ts[0] + "T" + ts[3];
  try {
    var timestamp = new Date(date);
  } catch (err) {
    return false;
  }
  return (
    timestamp instanceof Date && !isNaN(timestamp) && timestamp.getTime() > 0
  );
};

const valid_measurements = (measurements) => {
  const fields_to_check = new Set([
    "timestamp",
    "errorCode",
    "voltage",
    "distanceMm",
    "eventAccMm",
    "rainAccMm",
    "totalAccMm",
    "rainIntensity",
  ]);
  let valid_data = false;
  let valid_fields = false;
  if (Array.isArray(measurements)) {
    valid_data = measurements.every((measurement) => {
      for (let key in measurement)
        if (typeof measurement[key] === "string") {
          return valid_timestamp(measurement[key]);
        } else {
          if (
            typeof measurement[key] === "number" &&
            !isNaN(measurement[key])
          ) {
            return true;
          } else {
            return false;
          }
        }
    });
    valid_fields = measurements.every((measurement) => {
      for (let key in measurement.keys())
        if (fields_to_check.has(key)) {
          return true;
        } else {
          return false;
        }
    });
    return valid_data && valid_fields;
  } else {
    return false;
  }
};

const valid_notes = (notes) => {
  const fields_to_check = new Set(["username", "timestamp", "messageBody"]);
  let valid_data = false;
  let valid_fields = false;
  if (Array.isArray(notes)) {
    valid_fields = notes.every((note) => {
      for (field of note.keys())
        if (fields_to_check.has(field)) {
          return true;
        } else {
          return false;
        }
    });
    if (valid_fields)
      valid_data = notes.every((note) => {
        for (field of note.keys())
          if (typeof note[field] === "string") {
            if (field === "timestamp") {
              return valid_timestamp(note[field]);
            } else {
              return valid_string(note[field]);
            }
          } else {
            return false;
          }
      });
    return valid_data && valid_fields;
  } else {
    return false;
  }
};

const valid_impath = (imgpath) => {
  // will be updated with actual image path checking when we get to that point
  if (typeof imgpath === "string" && imgpath.trim().length > 0) {
    return true;
  } else {
    return false;
  }
};

const toExport = {
  valid_obj_id,
  valid_sensor_number,
  valid_string,
  valid_coords,
  valid_status,
  valid_timestamp,
  valid_measurements,
  valid_notes,
  valid_impath,
};

export default toExport;
