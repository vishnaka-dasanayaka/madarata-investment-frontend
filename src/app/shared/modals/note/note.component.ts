import { Component, Input } from "@angular/core";
import swal from "sweetalert2";
import { SettingsService } from "../../../core/_services/settings.service";
import { ToastrService } from "ngx-toastr";
import { SharedService } from "../../../core/_services/shared.service";

@Component({
  selector: "app-note",
  standalone: false,
  templateUrl: "./note.component.html",
  styleUrl: "./note.component.css",
})
export class NoteComponent {
  @Input() type: string | undefined;
  @Input() f_key: number | undefined;

  uniqueid: any;

  note: any;
  notes: any[] = [];

  edit_mode: boolean = false;
  edit_note_id: number = 0;

  constructor(
    private toastr: ToastrService,
    private sharedService: SharedService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.generateUniqueKey();
    this.getNotes();
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  getNotes() {
    var obj = {
      type: this.type,
      f_key: this.f_key,
    };

    this.settingsService.getNotes(obj).subscribe((data) => {
      if (data.status) {
        this.notes = [];
        this.notes = data.notes;
      }
    });
  }

  addNote() {
    const rawValue = this.note || "";

    let stripped = rawValue.replace(/<[^>]*>/g, "");
    stripped = stripped.replace(/&nbsp;/gi, " ");
    stripped = stripped.trim();

    if (!stripped) {
      swal.fire({
        title: "Warning!",
        text: "Note cannot be blank",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }

    var obj = {
      type: this.type,
      f_key: this.f_key,
      note: rawValue.trim(),
      uniquekey: this.uniqueid,
    };

    this.settingsService.addNote(obj).subscribe(
      (data) => {
        if (data.status) {
          this.toastr.success("Note added successfully.", "Success", {
            positionClass: "toast-top-right",
            closeButton: true,
            timeOut: 3000,
            progressBar: true,
            toastClass: "toast toast-sm", // <-- add your small class here
          });

          this.generateUniqueKey();
          this.getNotes();
          this.note = null;
        } else {
          this.toastr.warning(data.err, "ERROR !!", {
            positionClass: "toast-top-right",
            closeButton: true,
          });
          this.generateUniqueKey();
        }
      },
      (error) => {
        alert("API ERROR [ERRCODE:001]");
      }
    );
  }

  htmlSanitize(html: any) {
    return this.sharedService.htmlSanitize(html);
  }

  updateNoteStatus(id: number, status: number) {
    statusString = "";
    if (status == -2) {
      var statusString = "Delete";
    }

    swal
      .fire({
        title: "Please confirm that you want to " + statusString + " this note",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745", // ✅ Green button
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
        customClass: {
          title: "swal-title-sm",
          confirmButton: "swal-confirm-sm",
          cancelButton: "swal-cancel-sm",
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          var obj = {
            status: status,
            id: id,
            uniquekey: this.uniqueid,
          };
          this.settingsService.updateNoteStatus(obj).subscribe(
            (data) => {
              if (data.status) {
                this.toastr.success(
                  "Note has been deleted successfully.",
                  "Success",
                  {
                    positionClass: "toast-top-right",
                    closeButton: true,
                    timeOut: 3000,
                    progressBar: true,
                    toastClass: "toast toast-sm", // <-- add your small class here
                  }
                );

                this.generateUniqueKey();
                this.getNotes();
              } else {
                this.toastr.warning(data.err, "ERROR !!", {
                  positionClass: "toast-top-right",
                  closeButton: true,
                });
                this.generateUniqueKey();
              }
            },
            (error) => {
              alert("API ERROR [ERRCODE:001]");
            }
          );
        }
      });
  }

  onClickUpdateButton(id: number, note: string) {
    this.edit_mode = true;
    this.edit_note_id = id;
    this.note = note;
  }

  updateNote() {
    const rawValue = this.note || "";

    let stripped = rawValue.replace(/<[^>]*>/g, "");
    stripped = stripped.replace(/&nbsp;/gi, " ");
    stripped = stripped.trim();

    if (!stripped) {
      swal.fire({
        title: "Warning!",
        text: "Note cannot be blank",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }

    var obj = {
      id: this.edit_note_id,
      note: rawValue.trim(),
      uniquekey: this.uniqueid,
    };

    this.settingsService.updateNote(obj).subscribe(
      (data) => {
        if (data.status) {
          this.toastr.success("Note updated successfully.", "Success", {
            positionClass: "toast-top-right",
            closeButton: true,
            timeOut: 3000,
            progressBar: true,
            toastClass: "toast toast-sm", // <-- add your small class here
          });

          this.generateUniqueKey();
          this.getNotes();
          this.note = null;
          this.edit_mode = false;
          this.edit_note_id = 0;
        } else {
          this.toastr.warning(data.err, "ERROR !!", {
            positionClass: "toast-top-right",
            closeButton: true,
          });
          this.generateUniqueKey();
        }
      },
      (error) => {
        alert("API ERROR [ERRCODE:001]");
      }
    );
  }

  cancelEdit() {
    this.edit_mode = false;
    this.edit_note_id = 0;
    this.note = null;
  }
}
