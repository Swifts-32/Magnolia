// import { FunctionIcons, Train } from "./train.svelte";

// class TrainHandler {
//     trains: Map<number, Train> = new Map();

//     trackPower: boolean = $state(false);

//     addTrain(id: number, name: string) {
//         // this.trains.set(id, new Train(id, name));
//     }

//     getTrain(id: number | null): Train | null {
//         if (id == null) return null;

//         const train = this.trains.get(id);

//         if (train) {
//             return train;
//         }
//         return null;
//     }

//     writeSpeed(id: number, speed: number, direction: Direction) {
//         if (speed >= 0 && speed <= 127) {
//         }
//     }

//     writeFunction(id: number, func: number, state: boolean) {
//         if (func >= 0 && func <= 68) {
//         }
//     }

//     writeEStop() {
//     }


//     saveTrains() {
//         const jsonData = JSON.stringify(Array.from(this.trains.entries()));

//         try {
//             localStorage.setItem("trains", jsonData)
//         } catch (error) {
//             console.error("Failed to save data:", error);
//         }

//         console.log(jsonData);
//     }

//     loadTrains() {
//         const storedData = localStorage.getItem("trains");
//         if (!storedData) return console.log("No Data Found");

//         const parsedData: [number, any][] = JSON.parse(storedData);

//         this.trains = new Map(
//             parsedData.map(([key, trainData]: [number, Train]) => {
//                 let train = new Train(trainData.addr, trainData.name);

//                 // Add function map
//                 // train.functions = new Map(
//                 //     trainData.functions.map(
//                 //         ([funcKey, funcData]: [number, any]) =>
//                 //             [funcKey, Object.assign(new Funct(funcData.id, funcData.icon, funcData.mode), funcData)]
//                 //     )
//                 // );

//                 console.log(train);
//                 return [key, train];
//             })
//         )

//         const parsedArray = JSON.parse(storedData); // Parse back to an array
//         this.trains = new Map(parsedArray); // Convert array back to a Map
//     }

//     //Debug Statement:
//     addDefaultTrains() {

//         this.addTrain(3, "Thomas");
//         this.addTrain(10, "Loco 1");
//         this.addTrain(32, "Loco 2");

//         let a = this.getTrain(3);

//         if (a) {

//             a.addFunction(0, "toggle", FunctionIcons.Light1);
//             a.addFunction(2, "toggle", FunctionIcons.Light2);
//             a.addFunction(3, "toggle", FunctionIcons.Speaker);
//             a.addFunction(7, "toggle", FunctionIcons.Bell);
//             a.addFunction(5, "select", FunctionIcons.text);
//             a.addFunction(13, "select", FunctionIcons.text);
//             a.addFunction(14, "select", FunctionIcons.text);
//             a.addFunction(15, "select", FunctionIcons.text);
//             a.addFunction(16, "select", FunctionIcons.text);
//             a.addFunction(17, "select", FunctionIcons.text);
//             a.addFunction(18, "select", FunctionIcons.text);
//             a.addFunction(19, "select", FunctionIcons.text);
//             a.addFunction(20, "select", FunctionIcons.text);
//         }

//         // train2.addFunction(1, "toggle", FunctionIcons.Light1);
//         // train2.addFunction(3, "toggle", FunctionIcons.Light2);
//         // train2.addFunction(2, "toggle", FunctionIcons.Speaker);
//         // train2.addFunction(5, "toggle", FunctionIcons.Bell);
//         // train2.addFunction(6, "select", FunctionIcons.text);


//     }
// }

// export const trainHandler: TrainHandler = new TrainHandler();