export interface Korisnik {
  id: string;
  ime: string;
  prezime: string;
  email: string;
}

export interface Konobar {
  id: string;
  ime: string;
  prezime: string;
}

export interface Proizvod {
  id: string;
  naziv: string;
  opis: string;
  cena: number;
}

export interface RacunStavka {
  idProizvoda: string;
  kolicina: number;
}

export interface KreirajRacunDto {
  korisnikId: string;
  stavke: RacunStavka[];
}

export interface RacunProizvodResponse {
  idProizvoda: string;
  naziv: string;
  cena: number;
  kolicina: number;
  ukupno: number;
}

export interface Racun {
  id: string;
  datum: string;
  vreme: string;
  ukupnaCena: number;
  korisnikId: string;
  konobarId: string;
  stavke: RacunProizvodResponse[];
}

export interface LoginResponse {
  token: string;
  uloga: string;
  ime: string;
  id: string;
}
