const Habit = require("../models/habit");
const Dates = require("../models/habitDates");
const moment = require("moment");

module.exports.home = function (req, res) {
  Habit.find()
    .then(function (habits) {
      console.log(habits)

      return res.render("home", { title: "Home", habit_list: habits });
    })
    .catch(function (error) {
      console.log("Error in fetching habits from DB", error);
      return;
    });
};

module.exports.add = function (req, res) {
  const data = {
    user: "Ankit",
    habit_name: req.body.habit_name,
  };

  Habit.create(data)
    .then(function (newhabit) {
      return res.redirect("back");
    })
    .catch(function (error) {
      console.log("error in creating a habit");
      return;
    });

  return res.redirect("back");
};

module.exports.delete = function (request, response) {
  let id = request.query.id;
  if (id) {
    Habit.findByIdAndDelete(id)
      .then(function (data) {
        console.log("deleted", data);
        return response.redirect("back");
      })
      .catch(function (error) {
        console.log("error in deletion");
        return;
      });
  }
};

// Habit View Page
module.exports.viewHabit = function (request, response) {
  let id = request.query.id;
  if (id) {
    Habit.findById(id)
      .then(function (data) {
        return response.render("habit", {
          title: "Habit",
          habit_name: data.habit_name,
        });
      })
      .catch(function (error) {
        console.log("error on viewHabit", error);
      });
  }
};

// Fetch Habits
module.exports.FetchHabit = async function (request, response) {
  const id = request.query.id;
  if (id) {
    Habit.findById(id)
      .then(async (habit) => {
        if (habit) {
          let dates_with_status = await habit.populate("dates");
          let date_diff = dates_with_status.dates.map((i) => {
            const month = (i.date.getMonth() + 1).toString();
            const date = i.date.getDate().toString();
            const year = i.date.getFullYear().toString();
            const date_format = month + "/" + date + "/" + year;
            return { [date_format]: i.status };
          });
          let finalObj = {};
          for (let i = 0; i < date_diff.length; i++) {
            Object.assign(finalObj, date_diff[i]);
          }
          dates_with_status["days"] = finalObj;

          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify(finalObj));
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }
};

module.exports.updateHabit = function (request, response) {
  const id = request.query.id;
  let querydate = request.query.date;
  const value = request.query.value;

  if (id) {
    Habit.findById(id)
      .populate("dates")
      .then((habit) => {
        if (habit) {
          let date_id = habit.dates.filter((i) => {
            const month = (i.date.getMonth() + 1).toString();
            const date = i.date.getDate().toString();
            const year = i.date.getFullYear().toString();
            const date_format = month + "/" + date + "/" + year;
            if (date_format == querydate) {
              return i;
            }
          });

          if (value == 1) {
            const data = {
              habit: id,
              date: new Date(moment(querydate, "MM/DD/YYYY")),
              status: true,
            };
            Dates.create(data).then((date) => {
              habit.dates.push(date._id);
              habit.save();
            });
          } else if (value == 0 && date_id[0]) {
            Dates.updateOne(
              { _id: date_id[0]._id },
              { $set: { status: false } }
            )
              .then((data) => {
                console.log("updated Successfully");
              })
              .catch((error) => {
                console.log("errr", error);
              });
          } else if (value == -1 && date_id[0]) {
            habit.dates.pull(date_id[0]._id);
            habit.save();
            Dates.findByIdAndDelete({ _id: date_id[0]._id });
          }
        }
      });
  }
};
