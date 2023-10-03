import { Form } from "react-router-dom";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

export function BirthdayForm() {
  let currentDate = new Date();

  const [myMonth, setMyMonth] = useState(currentDate);
  const [myYear, setMyYear] = useState(currentDate);
  const [myDay, setMyDay] = useState(currentDate);

  const minDate = new Date(myYear.getFullYear(), myMonth.getMonth(), 1);
  const maxDate = new Date();

  useEffect(() => {
    setMyDay(new Date(myYear.getFullYear(), myMonth.getMonth(), 1));
  }, [myMonth, myYear, setMyDay]);

  useEffect(
    () => setMyMonth(new Date(myYear.getFullYear(), myMonth.getMonth(), 1)),
    [myYear]
  );

  useEffect(() => {
    (currentDate = new Date(
      myYear.getFullYear(),
      myMonth.getMonth(),
      myDay.getDay()
    )),
      [myDay, myMonth, myYear];
  });

  const renderDayContents = (_: number, date: Date) => {
    if (date < minDate || date > maxDate) {
      return <span></span>;
    }
    return <span>{date.getDate()}</span>;
  };

  return (
    <>
      <Form method="post" className="w-full">
        <div className="flex justify-center items-center">
          <div className="p-2">
            <label>Year</label>
            <DatePicker
              required
              className="w-full border-2 rounded-md bg-inherit p-2 cursor-pointer"
              selected={myYear}
              onChange={(date: Date) => setMyYear(date)}
              showYearPicker
              dateFormat="yyyy"
              maxDate={maxDate}
            />
          </div>
          <div className="p-2">
            <label>Month</label>
            <DatePicker
              required
              className="w-full border-2 rounded-md bg-inherit p-2 cursor-pointer"
              showMonthYearPicker
              dateFormat="MMMM"
              selected={myMonth}
              renderCustomHeader={() => <></>}
              onChange={(date: Date) => setMyMonth(date)}
              maxDate={maxDate}
            />
          </div>
          <div className="p-2">
            <label>Day</label>
            <DatePicker
              required
              className="w-full border-2 rounded-md bg-inherit p-2 cursor-pointer"
              dateFormat="dd"
              selected={myDay}
              renderDayContents={renderDayContents}
              renderCustomHeader={() => <></>}
              onChange={(date: Date) => setMyDay(date)}
              maxDate={maxDate}
            />
          </div>
        </div>
      </Form>
    </>
  );
}
