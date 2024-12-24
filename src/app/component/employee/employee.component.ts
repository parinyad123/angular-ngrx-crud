import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { Employee } from '../../model/Employee';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { EmployeeService } from '../../service/employee.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; // support currency
import { Store } from '@ngrx/store';
import { deleteEmployee, loadEmployee } from '../../Store/Employee.Action';
import { getEmpList } from '../../Store/Employee.Selector';

@Component({
  selector: 'app-employee',
  imports: [MatCardModule, MatButtonModule, MatDialogModule, MatTableModule, CommonModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit, OnDestroy {

  empList:Employee[] =[];
  dataSource!:MatTableDataSource<Employee>
  displayedColumns:string[] = ['id', 'name', 'role', 'doj', 'salary', 'action']
  subscription = new Subscription()

  // constructor(private dialog:MatDialog, private service:EmployeeService) { } // old

  constructor( // the constructor of the EmployeeComponent class, which is used to inject dependencies into the component
    private dialog:MatDialog, 
    private store: Store
  ) {

  }

  // ==== Lifecycle Hooks =====
  ngOnInit(): void { //  This lifecycle hook is called once the component is initialized
    this.GetallEmployee();
  }
  ngOnDestroy(): void { // This lifecycle hook is called when the component is destroyed
    this.subscription.unsubscribe();
  }
  // ==========================

  GetallEmployee() { // The method is called to fetch and display the list of employees.
    // let sub = this.service.GetAll().subscribe(item=>{
    //   this.empList=item;
    //   this.dataSource = new MatTableDataSource(this.empList);
    // })
    // this.subscription.add(sub);
    this.store.dispatch(loadEmployee()) // Dispatch loadEmployee action to fetch employees
    this.store.select(getEmpList).subscribe(item=>{
      this.empList = item;
      this.dataSource = new MatTableDataSource(this.empList);  // Update the dataSource for the table
    })
  }
  addemployee() {
    this.openpopup(0);
  }

  DeleteEmployee(empId:number) {
    if(confirm('Are you sure?')) {
      // let sub = this.service.Delete(empId).subscribe(item=>{
      //   this.GetallEmployee();
      // })
      // this.subscription.add(sub)
      this.store.dispatch(deleteEmployee({ empId: empId }));
    }

  }

  EditEmployee(empId:number) {
    this.openpopup(empId);
  }

  openpopup(empid:number) {
    this.dialog.open(AddEmployeeComponent, {
      width: '50%',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: {
        'code': empid
      }
    }).afterClosed().subscribe(o=>{ // subscribe method is used with the observable returned by the afterClosed() method
      this.GetallEmployee(); // afterCloesd to auto update page
    });
  }

}
