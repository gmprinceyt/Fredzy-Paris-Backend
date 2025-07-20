export interface MyDocument {
    total?:number;
    discount?:number;
    createdAt: Date;
}

type funProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total"
};

export const getChartDataByMonth = ({ length, docArr, today,property }: funProps) => {
  const data = new Array(length).fill(0);

  docArr.forEach((i) => {
    const orderCreationDate = i.createdAt;
    const monthDiff =
      (today.getMonth() - orderCreationDate.getMonth() + 12) % 12;

   if (property){
     data[data.length - monthDiff - 1] += i[property];
   } else {
     data[data.length - monthDiff - 1] += 1;
   }
  });

  return data;
};
