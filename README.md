# <b> “Snap it out” </b>

### 1.Problem biznesowy: Zarządzanie projektami w firmie 

  Snap It Out jest aplikacją pozwalającą zarządzać zadaniami za pomocą tablic. Umożliwia zalogowanie się oraz rozporządzanie zadaniami w obrębie organizacji oraz projektów dla użytkowników w zależności od ich uprawnień. Za pomocą tablic możliwe jest systematyzowanie zadań oraz przypisywanie ich do użytkowników oraz etapów pracy. 
  Aplikacja ma na celu ukazywać prosty i przejrzysty sposób planowania, rozdziału oraz kontroli zadań. Pozwala na utworzenie i zarządzanie projektami w obrębie organizacji, widoczny podział etapów projektu, a także przypisanie poszczególnych zadań do użytkowników. 
Zaproponowana aplikacja jest tylko elementem postawionego problemu biznesowego, który ma za zadanie uzupełniać obraną strategię zarządzania organizacją.


### 2.Wymagania systemowe i funcjonalne
Import potrzebnych bibliotek:
- React 
- NodeJS
- JavaScript
- SQL (MySQL) - preferowany program XAMPP Apache 

#### 2.1 Model Architektury
Architektura Model-View-Controller  
	
#### 2.2 Funkcjonalnosci   

Funkcje
- Bezpieczny system uwierzytelniania, aby umożliwić użytkownikom logowanie się do aplikacji przy użyciu adresu e-mail/nazwy użytkownika i hasła.
- Typy użytkowników cechują się różnymi uprawnieniami. Podgrupy dostępne dla <b>Snap It Out</b> to”:
<b>Admin</b> - uprawnienia do zarządzania użytkownikami oraz organizacjami - ogólne zarządządzanie dostepem, tworzenie oraz usuwanie kont w tym przypisywanie do konkretnych organizacji, zmiana typu użytkowników (zmiana roli) oraz edycja szczegółów organizacji.
<b>Manager</b> - uprawnienia do zarząrzania użytkownikami i projektami w obrębie własnej organizacji. Odpowiada za pełny nadzór nad projektami wewnątrz organizacji w tym tworzenie, edycja czy przypisywanie użytkowników.
<b>Senior; Mid; Junior; Student; </b>

c) Każdy Projekt posiada 1 tablicę kanban, z której może korzystać każdy użytkownik tego projektu.

d) Każda tablica Kanban ma funkcjonalność "przeciągnij i upuść" w tym edycję kolumn i zadań, które może tworzyć dowolny użytkownik tego projektu.
3 domyślne kolumny o nazwach : <b>ZADANIA</b> (TASKS) , <b>W TOKU</b> (IN PROGRES) i <b>ZROBIONE</b>.

e) Każda kolumna tablicy Kanban będzie mieć zadania (TASKI), które można przeciągać i przenosić, które może tworzyć dowolny użytkownik tego projektu, ale mogą być usuwane tylko przez użytkownika z rangą "Manager" organizacji (który jest również kierownikiem projektów tej organizacji).

f) Każde zadanie kolumny tablicy Kanban posiada atrybuty takie jak:
- Data rozpoczęcia, 
- Planowa data zakończenia/Datę zakończenia,
- Ważność zadania od 1 do 5 oznaczane odpowiednim kolorem:
	- Zielony
	- Niebieski
	- Żółty
	- Pomarańczowy
	- Czerwony
<b> Wszyscy użytkownicy projektu będą mogli zmienić kolor tylko swoich zadań. </b>

Baza danych MySQL zawiera informacje o:
- użytkownikach, 
- organizacjach, 
- projektach organizacji, 
- tablicach Kanban wewnątrz projektów, 
- kolumnach wewnątrz tablic Kanban
- zadaniach wewnątrz kolumn 

#### 2.3 Model komunikacji asychroniczny  

### 3. Harmonogram prac i zespół projektowy

#### Członkowie zespołu: 
- Magdalena Lipka aka Frog-Has-Curls, 
- Piotr Szulc aka OAH, 
- Oskar Gniewek aka pinholeye (<b>Tech-lead</b>).<br>

#### Harmonogram
- 1.Inicjacja środowiska w NodeJS - Frog-Has-Curls 
	- Przygotowanie potrzebnych paczek  
- 2.Połączenie z serwerem - Frog-Has-Curls  
- 3.Polączenie dockera - Frog-Has-Curls 
- 4.Implemntacja baz danych + docker - OAH
- 5.Inicjacja środowiska React - pinholeye
- 6.Kolumny i cały interface CSS - pinholeye 
- 7.Funcjonalnosci - pinholeye + OAH 
    - Logowanie uzytkownikow - OAH 
	- dodawanie/usuwanie taskow - pinholeye
	- drag and drop - pinholeye 
	- archiwizacja skonczonych taksow - pinholeye 
	- ważność tasków - pinholeye

### 4. Analiza zagadnienia i jego modelowanie

### 5. Implementacja i testowanie

### 6. Podsumowanie
      

