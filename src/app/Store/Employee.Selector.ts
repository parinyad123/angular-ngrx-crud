import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EmployeeModel } from "./Employee.Model";

const getEmployeeState = createFeatureSelector<EmployeeModel>('emp') 

export const getEmpList = createSelector(getEmployeeState, (state) => state.list) 

export const selectEmployee = createSelector(getEmployeeState, (state)=> state.empobj)