export const getChartDataByMonth = ({ length, docArr, today, property }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const orderCreationDate = i.createdAt;
        const monthDiff = (today.getMonth() - orderCreationDate.getMonth() + 12) % 12;
        if (property) {
            data[data.length - monthDiff - 1] += i[property];
        }
        else {
            data[data.length - monthDiff - 1] += 1;
        }
    });
    return data;
};
//# sourceMappingURL=RepeatCode.js.map