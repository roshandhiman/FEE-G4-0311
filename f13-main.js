"use strict";
import { grade, attendance, showMsg } from "./grade.js";
import { createInterface } from "node:readline";
import { stdin as input, stdout as output, exit } from "node:process";

const rl = createInterface({ input, output });
const answers = rl[Symbol.asyncIterator]();

async function askNumber(question){
    output.write(question);
    const answer = await answers.next();
    const value = Number(answer.value);
    if(answer.done || Number.isNaN(value)){
        showMsg("Please enter a valid number.");
        rl.close();
        exit(1);
    }
    return value;
}

const totalDays = await askNumber("Enter total days: ");
const presentDays = await askNumber("Enter present days: ");
const marks = await askNumber("Enter marks: ");
rl.close();

const attendancePercent = attendance(totalDays, presentDays);
const result = grade(marks);
const str = `Grade is ${result} and attendance is ${attendancePercent}%`;
showMsg(str);
