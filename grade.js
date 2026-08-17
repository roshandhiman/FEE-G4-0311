export function grade(marks){
    if(marks >= 90) return 'A';
    if(marks >= 80) return 'B';
    if(marks >= 70) return 'C';
    if(marks >= 60) return 'D';
    return 'F';
}

export function attendance(tDays, pDays){
    let x = 0;
    x = (pDays / tDays) * 100;
    x = x.toFixed(2);
    return x;
}

export function showMsg(str){
    console.log(str);
}
