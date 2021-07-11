## Projekt

Nazwa projektu: <b> “Snap it out (SiO2)” </b><br>
Członkowie zespołu: 
- Magdalena Lipka aka Frog-Has-Curls, 
- Piotr Szulc aka OAH, 
- Oskar Gniewek aka pinholeye.

Tech-lead: 
- Oskar Gniewek aka pinholeye <br>

## 1.Problem biznesowy: Zarządzanie projektami w firmie

Problem biznesowy opiera się o zarządzaniu projektami w firmie. Celem jest stworzenie platformy, która będzie narzędziem do zarządzania projektami dla wielu klientów (firm) w formie strategii kanban

## 2.Wymagania systemowe i funcjonalne
### Import potrzebnych bibliotek:
- SQL (MySQL)
- React 
- JS
- Recharts (wykresy)
-math
-random

### Serwer
Postawienie serwera w node.js na AWS

### Baza Danych
Stworzenie bazy danych w node  
#### Struktura:  
Tabela ze wszystkimi organizacjami -> tabela projektow -> tabela poejdynczygo (sprzezone tabele)  
#### zdecentralizowane:
- Tabela czlonkowie/pracownicy projektow  
+przypisane projekty/organizacje  
+właściwości
- zdecentralizowany request i send  

### Funkcjonalności:
- Zapisywanie i usuwanie notatek
- Tworzenie i organizacja kolumn
- Grab and move
- Typy notatek (Grupowanie, Waga/Ważność)
- Przypisanie do 
- Tworzenie kont:
	- Założyciel organizacji (organizacje)
	- Pracownik, Admin, ect
	- Standard User (poza organizacją)
- Automatyczne przypisanie notatki danego typu do pracownika odpowiedzialnego
- Statystyki!!! :3 (wykresiki, analizy ect.) ******

### Podstrony:
- About
- Orgnizacja
- H@ Organizacji
- Projekt
- Projekt Admin

2.1 Architektura Model-View-Controller   
2.2 Funkcjonalnosci   
2.3 Model komunikacji asychroniczny  
3. Harmonogram prac i zespół projektowy
4. Analiza zagadnienia i jego modelowanie
5. Implementacja i testowanie
6. Podsumowanie

## Harmonogram prac i zespół projektowy start - 25.05

- 1.Inicjacja środowiska w NodeJS - Magda - 3 dni  
	- Pobranie potrzebnych paczek  
- 2.Poączenie z serwerem - Magda - tydzień  
- 3.Polączenie dockera - Magda - tydzień  
- 4.Implemntacja baz danych + docker - Piotr - 3 dni  
- 5.Inicjacja środowiska React - Oskar - 3 dni  
- 6.Kolumny i caly interface CSS - Oskar - tydzien   
- 7.Funcjonalnosci - Oskar + Piotr - 20 dni  
    - Logowanie uzytkownikow - Piotr - 4 dni  
	- dodawanie/usuwanie taskow - Oskar - 3 dni  
	- drag and drop - Oskar - tydzien  
	- archiwizacja skonczonych taksow - Oskar - 4 dni  
	- ważność tasków - Oskar - 3 dni
      
### Analiza zagadnienia i jego modelowanie
see branch
