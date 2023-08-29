import { Component } from '@angular/core'
import { Task } from './task/task'
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop'
import { MatDialog } from '@angular/material/dialog'
import { TaskDialogResult } from './task-dialog/task-dialog'
import { TaskDialogComponent } from './task-dialog/task-dialog.component'
import {
  Firestore,
  collectionData,
  collection,
  runTransaction,
  deleteDoc,
  addDoc,
  updateDoc,
  documentId,
  doc
} from '@angular/fire/firestore'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todo: Observable<Task[]>
  inProgress: Observable<Task[]>
  done: Observable<Task[]>

  constructor(private dialog: MatDialog, private store: Firestore) {
    const todos = collection(this.store, 'todo')
    const inProgress = collection(this.store, 'inProgress')
    const done = collection(this.store, 'done')

    this.todo = collectionData(todos, { idField: 'id' }) as Observable<Task[]>
    this.inProgress = collectionData(inProgress, { idField: 'id' }) as Observable<Task[]>
    this.done = collectionData(done, { idField: 'id' }) as Observable<Task[]>
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: `${270 / 16}rem`,
      data: {
        task: {},
      },
    })

    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) return

        const addCollection = collection(this.store, 'todo')
        addDoc(addCollection, result.task)
      })
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: `${270 / 16}rem`,
      data: {
        task,
        enableDelete: true,
      },
    })

    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) return

        if (result.delete) {
          const deleteCollection = collection(this.store, list)
          const deleteItem = doc(deleteCollection, task.id)

          deleteDoc(deleteItem)
        } else {
          const updateCollection = collection(this.store, list)
          const updateItem = doc(updateCollection, task.id)

          updateDoc(updateItem, { ...task })
        }
      })
  }

  drop(event: CdkDragDrop<Task[] | null>): void {
    if (!event.container.data || !event.previousContainer.data) return

    if (event.previousContainer === event.container) {
      return moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
    }

    const item = event.previousContainer.data[event.previousIndex]

    runTransaction(this.store, () => {
      const deleteCollection = collection(this.store, event.previousContainer.id)
      const deleteItem = doc(deleteCollection, item.id)

      const addCollection = collection(this.store, event.container.id)

      const promise = Promise.all([
        deleteDoc(deleteItem),
        addDoc(addCollection, item)
      ])

      return promise
    })

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    )
  }
}
