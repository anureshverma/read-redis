const redis = require("redis");
const Content = require("../models/content");
const key = require("../models/key");
const Key = require("../models/key");

const client = redis.createClient({
  host: `${process.env.REDIS_HOST}`,
  port: process.env.REDIS_PORT,
  password: `${process.env.REDIS_PASSWORD}`,
});

client.on("connect", function () {
  console.log("Redis client connected");
});

client.on("error", function (error) {
  console.error(error);
});

const getDataOfKey = (key) => {
  client.get(key, async (err, result) => {
    if (err) return console.log(err);

    const count = await Content.countDocuments({ key: key }).exec();
    console.log("count of object ", count);
    if (count === 0) {
      const content = new Content({
        content: result,
        key: key,
      });
      try {
        await content.save();
        console.log("after save");
      } catch (error) {
        console.log("error in saving ", error);
      }
    }
    if (count > 0) {
      try {
        await Content.findOneAndUpdate(
          { key: key },
          { content: result }
        ).exec();
        console.log("after update ");
      } catch (error) {
        console.log("error in update ", error);
      }
    }
  });
};

deleteContent = async (key) => {
  try {
    await Content.deleteOne({ key: key }).exec();
  } catch (error) {
    console.log("Error in delete conetent", error);
  }
};

client.keys("*", async (err, keys) => {
  if (err) return console.log(err);

  console.log("keys", keys);
  const result = await Key.findOne({ redisDatabase: "read-redis" }).exec();
  console.log("result of query", result);
  if (!result) {
    const keyInDb = new Key({
      redisDatabase: "read-redis",
      keys: keys,
    });
    try {
      await keyInDb.save();
    } catch (error) {
      console.log("Error in saving keys ", error);
    }
    keys.forEach((e) => {
      getDataOfKey(e);
    });
  } else {
    const keysInDb = result.keys;
    const keysToDelete = keysInDb.filter((item) => !keys.includes(item));
    console.log("keysToDelete", keysToDelete);
    try {
      await Key.findOneAndUpdate(
        { redisDatabase: "read-redis" },
        { keys: keys }
      ).exec();
      console.log("after update ");
    } catch (error) {
      console.log("error in update ", error);
    }
    keysToDelete.forEach((e) => {
      deleteContent(e);
    });
    keys.forEach((e) => {
      getDataOfKey(e);
    });
  }
});
