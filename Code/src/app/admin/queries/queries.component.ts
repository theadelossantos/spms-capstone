import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

interface Query {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}

@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.css']
})

export class QueriesComponent {
  queries: Query[] = [];
  p: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  pages: number[] = [];
  displayedQueries: Query[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(){
    this.authService.getQueries().subscribe((data: Query[]) => {
      this.queries = data;
      this.totalItems = this.queries.length;
      this.updatePagination();
      this.setPage(this.p);
    });
  }

  deleteMessage(queryId: number) {
    const confirmDelete = window.confirm('Are you sure you want to delete this subject?');

    if (confirmDelete) {
      this.authService.delQueries(queryId).subscribe((data) => {
        this.queries = this.queries.filter(query => query.id !== queryId);
        this.totalItems--;
        this.updatePagination();
        this.setPage(this.p);
      });
    }
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.pages.length) {
      this.p = page;
      const start = (page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.displayedQueries = this.queries.slice(start, end);
    }
  }

  updatePagination() {
    this.pages = Array(Math.ceil(this.totalItems / this.itemsPerPage)).fill(0).map((x, i) => i + 1);
  }
}
