import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { EmployeeComponent } from './component/employee/employee.component';

export const routes: Routes = [
    { 
        path: 'employee', 
        component: EmployeeComponent 
    }
];
