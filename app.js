const express = require("express");
const ExpressError = require("./expressError");
const app = express();
app.use(express.json());

// mean
app.get("/mean", function (request, response, next) {
  // let nums = request.query.nums;

  try {
    let nums = request.query.nums;

    // error handling #1
    if (!nums) throw new ExpressError("no data", 400);
    nums = nums.replaceAll(" ", "");
    const arNums = Array.from(nums.replaceAll(",", "")).map((x) => parseInt(x));

    // error handling #2
    if (arNums.some((item) => isNaN(item))) {
      throw new ExpressError("not a number", 400);
    }
    const mySum = arNums.reduce(function (base, accumulator) {
      return base + accumulator;
    }, 0);

    const average = mySum / arNums.length;
    const returnObject = { operation: "mean", value: average };
    return response.json(returnObject);

    // send error to middleware
  } catch (e) {
    next(e);
  }
});

// median
app.get("/median", function (request, response) {
  let nums = request.query.nums;
  nums = nums.replaceAll(" ", "");
  const arNums = Array.from(nums.replaceAll(",", "")).map((x) => parseInt(x));
  let median;
  arNums.sort(function (a, b) {
    return a - b;
  });
  const isEven = arNums.length % 2 === 0;
  if (isEven) {
    median = (arNums[arNums.length / 2] + arNums[arNums.length / 2 - 1]) / 2;
  } else {
    median = arNums[Math.floor(arNums.length / 2)];
  }
  const returnObject = { operation: "median", value: median };
  return response.json(returnObject);
});

// mode
app.get("/mode", function (request, response) {
  let nums = request.query.nums;
  nums = nums.replaceAll(" ", "");
  const numberList = Array.from(nums.replaceAll(",", "")).map((x) =>
    parseInt(x)
  );

  // count how often each occurs, put into object
  let counts = {};
  numberList.forEach(function (e) {
    if (counts[e] === undefined) {
      counts[e] = 0;
    }
    counts[e] += 1;
  });

  // find the highest count of repeated numbers
  let countsArray = numberList.map((element) => {
    return counts[element];
  });
  maxNum = Math.max(...countsArray);

  // extract the indices of numbers with the most repeats
  let indices = countsArray
    .map((element, index) => {
      if (element === maxNum) {
        return index;
      }
    })
    .filter((element) => {
      return element !== undefined;
    });

  if (indices.length === numberList.length) {
    const returnObject = { operation: "mode", value: "no mode" };
    return response.json(returnObject);
  }

  // if there is a mode, put these into a set to remove duplicates
  let mySet = new Set();
  for (index of indices) {
    mySet.add(numberList[index]);
  }

  // prepare to return this value (one or more)
  answer = [...mySet].join(",");

  const returnObject = { operation: "mode", value: answer };
  return response.json(returnObject);
});

// middleware to handle errors
app.use(function (err, req, res, next) {
  let status = err.status || 500;
  let message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

// // listening on Port 3000
// app.listen(3000, function () {
//   console.log("App on port 3000");
//   console.log("Lets party!");
// });

module.exports = app;