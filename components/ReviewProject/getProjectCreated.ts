import { ContractReceipt, ContractTransaction } from "ethers";

export const getProjectCreated = ({ events }: ContractReceipt) =>
  events.find(({ event }) => event === "ProjectCreated");
