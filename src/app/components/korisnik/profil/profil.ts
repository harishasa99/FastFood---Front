export class ProfilComponent implements OnInit {
  ime = '';
  prezime = '';
  email = '';
  staraLozinka = '';
  novaLozinka = '';
  ucitavanje = true;

  private apiUrl = 'https://fastfood-backend-production-322f.up.railway.app/api/korisnik';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    this.http.get<any>(`${this.apiUrl}/profil`).subscribe({
      next: (data) => {
        this.ime = data.ime;
        this.prezime = data.prezime;
        this.email = data.email;
        this.ucitavanje = false;
      },
      error: () => {
        this.ime = this.auth.getIme() || 'Korisnik';
        this.ucitavanje = false;
        this.snackBar.open('Greška pri učitavanju profila', 'OK', { duration: 3000 });
      },
    });
  }

  sacuvaj() {
    const dto: any = { ime: this.ime, prezime: this.prezime, email: this.email };
    if (this.novaLozinka) {
      dto.staraLozinka = this.staraLozinka;
      dto.novaLozinka = this.novaLozinka;
    }
    this.http.put(`${this.apiUrl}/profil`, dto).subscribe({
      next: () => {
        localStorage.setItem('ime', this.ime);
        this.snackBar.open('Profil ažuriran!', 'OK', { duration: 3000 });
      },
      error: () => this.snackBar.open('Greška pri ažuriranju profila', 'OK', { duration: 3000 }),
    });
  }
}
