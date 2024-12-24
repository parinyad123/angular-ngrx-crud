import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { provideNativeDateAdapter } from '@angular/material/core';
import { Employee } from '../../model/Employee';
// import { EmployeeService } from '../../service/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { addEmployee, getEmployee, updateEmployee } from '../../Store/Employee.Action';
import { selectEmployee } from '../../Store/Employee.Selector';

@Component({
  selector: 'app-add-employee',
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, 
    MatButtonModule, MatInputModule, MatSelectModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  title = 'Add Employee';
  dialodata: any; // Stores the data passed from the dialog (empid)
  isEdit=false; // This is "Add" mode

  // constructor(private service:EmployeeService, private ref:MatDialogRef<AddEmployeeComponent>, 
  //   private toastr:ToastrService, @Inject(MAT_DIALOG_DATA) public data:any
  // ) {

  // }

  constructor(private store: Store, // NgRx Store ที่ถูก inject เข้ามาใน Component เพื่อให้สามารถทำงานร่วมกับ NgRx Store ได้.
    // private หมายความว่า ตัวแปร store จะสามารถใช้งานได้ภายในคลาสนี้เท่านั้น และจะถูก inject โดย Angular โดยอัตโนมัติ.
    private ref:MatDialogRef<AddEmployeeComponent>, // MatDialogRef ใช้เพื่อปิด dialog หรือควบคุมการแสดงผลของ dialog จากใน component
    private toastr:ToastrService, // ToastrService ถูก inject มาเพื่อใช้ในการแสดง ข้อความแจ้งเตือน
    @Inject(MAT_DIALOG_DATA) public data:any  // @Inject(MAT_DIALOG_DATA): ใช้เพื่อรับข้อมูลที่ถูกส่งมาจาก dialog 
  ) {  

  }


  ngOnInit(): void {
    this.dialodata = this.data;
    if(this.dialodata.code>0) { // if dialodata.code (empid) = 0 [title = 'Add Employee']
      this.title='Edit Employee'; 
      this.isEdit = true;
      this.store.dispatch(getEmployee({empId: this.dialodata.code})); // new
      this.store.select(selectEmployee).subscribe(item => {
        let _data=item;
        if(_data != null){
          this.empForm.setValue({
            id: _data.id,
            name: _data.name,
            doj: _data.doj,
            role: _data.role,
            salary: _data.salary
          })
        }

      })
      // this.service.Get(this.dialodata.code).subscribe(item=>{
      //   let _data=item;
      //   if(_data != null){
      //     this.empForm.setValue({
      //       id: _data.id,
      //       name: _data.name,
      //       doj: _data.doj,
      //       role: _data.role,
      //       salary: _data.salary
      //     })
      //   }
      // })
    }
  }

  // สร้าง Reactive Form โดยใช้ FormGroup และ FormControl 
  // เพื่อสร้างฟอร์มที่ใช้ในการรับข้อมูลจากผู้ใช้ 
  // โดยการใช้ form validation เพื่อให้แน่ใจว่าผู้ใช้กรอกข้อมูลที่จำเป็นและถูกต้อง.
  empForm = new FormGroup({
    id: new FormControl(0),
    // FormControl นี้ถูกสร้างขึ้นสำหรับฟิลด์ name
    name: new FormControl('', Validators.required), // ค่าเริ่มต้นของ name คือ ค่าว่าง ('')., Validators.required ใช้ในการตรวจสอบว่า name ต้องไม่เป็นค่าว่าง (เพราะต้องกรอก name)
    doj: new FormControl(new Date(), Validators.required),
    role: new FormControl('', Validators.required),
    salary: new FormControl(0, Validators.required)
  })

  SaveEmployee() {
    
    if (this.empForm.valid) { // ตรวจสอบว่า Form ถูกกรอกข้อมูลถูกต้องหรือไม่
      console.log(this.empForm.value);

      let _data:Employee = { // สร้างอ็อบเจ็กต์ Employee จากข้อมูลในฟอร์ม
        id: this.empForm.value.id as number, // ดึงค่าจากฟอร์มและแปลงเป็น number
        name: this.empForm.value.name as string,
        doj: new Date(this.empForm.value.doj as Date),
        role: this.empForm.value.role as string,
        salary: this.empForm.value.salary as number,
      }

      if(!this.isEdit) {
        // this.service.Update(_data).subscribe(item=> {
        //   // alert('saved');
        //   this.toastr.success('Saved successfully', 'Updated');
        //   this.closepopup();
        // });
        this.store.dispatch(addEmployee({data: _data}));

      } else {
        // this.service.Create(_data).subscribe(item=> {
        //   this.toastr.success('Saved successfully', 'Created');
        //   this.closepopup();
        // });
        this.store.dispatch(updateEmployee({data: _data}));
      }
      this.closepopup(); //new

      
    }
  }
  closepopup() {
    this.ref.close();
  }
}
