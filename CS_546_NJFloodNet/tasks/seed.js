import { users } from "../config/mongoCollections.js";

const addEmailSubscriptionField = async () => {
  try {
    const userData = await users();

    // Update all user documents, adding the 'emailSubscription' field if it doesn't exist
    const result = await userData.updateMany(
      { emailSubscription: { $exists: false } }, // Match users without the field
      { $set: { emailSubscription: false } } // Add field with default value
    );

    console.log(
      `Updated ${result.matchedCount} users. Modified ${result.modifiedCount} users.`
    );
  } catch (e) {
    console.error("Error adding emailSubscription field:", e.message || e);
  }
};

addEmailSubscriptionField();
