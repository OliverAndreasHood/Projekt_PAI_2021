## Projekt

Nazwa projektu: <b> “Snap it out” </b><br>


## 1.Problem biznesowy: Zarz¹dzanie projektami w firmie 

Snap It Out jest aplikacj¹ pozwalaj¹c¹ zarz¹dzaæ zadaniami za pomoc¹ tablic. Umo¿liwia zalogowanie siê oraz rozporz¹dzanie zadaniami w obrêbie organizacji oraz projektów dla u¿ytkowników w zale¿noœci od ich uprawnieñ. Za pomoc¹ tablic mo¿liwe jest systematyzowanie zadañ oraz przypisywanie ich do u¿ytkowników oraz etapów pracy. 
Aplikacja ma na celu ukazywaæ prosty i przejrzysty sposób planowania, rozdzia³u oraz kontroli zadañ. Pozwala na utworzenie i zarz¹dzanie projektami w obrêbie organizacji, widoczny podzia³ etapów projektu, a tak¿e przypisanie poszczególnych zadañ do u¿ytkowników. 
Zaproponowana aplikacja jest tylko elementem postawionego problemu biznesowego, który ma za zadanie uzupe³niaæ obran¹ strategiê zarz¹dzania organizacj¹.


## 2.Wymagania systemowe i funcjonalne
### Import potrzebnych bibliotek:
- React 
- NodeJS
- JavaScript
- SQL (MySQL) - preferowany program XAMPP Apache

### Serwer
Postawienie serwera w node.js na AWS

### Baza Danych
Stworzenie bazy danych w node  
#### Struktura:  
Tabela ze wszystkimi organizacjami -> tabela projektow -> tabela poejdynczygo (sprzezone tabele)  
#### zdecentralizowane:
- Tabela czlonkowie/pracownicy projektow  
+przypisane projekty/organizacje  
+w³aœciwoœci
- zdecentralizowany request i send  


2.1 Model Architektury
Architektura Model-View-Controller  
	
2.2 Funkcjonalnosci   

Funkcje
- Bezpieczny system uwierzytelniania, aby umo¿liwiæ u¿ytkownikom logowanie siê do aplikacji przy u¿yciu adresu e-mail/nazwy u¿ytkownika i has³a.
- Typy u¿ytkowników cechuj¹ siê ró¿nymi uprawnieniami. Podgrupy dostêpne dla <b>Snap It Out</b> to”:
<b>Admin</b> - uprawnienia do zarz¹dzania u¿ytkownikami oraz organizacjami - ogólne zarz¹dz¹dzanie dostepem, tworzenie oraz usuwanie kont w tym przypisywanie do konkretnych organizacji, zmiana typu u¿ytkowników (zmiana roli) oraz edycja szczegó³ów organizacji.
<b>Manager</b> - uprawnienia do zarz¹rzania u¿ytkownikami i projektami w obrêbie w³asnej organizacji. Odpowiada za pe³ny nadzór nad projektami wewn¹trz organizacji w tym tworzenie, edycja czy przypisywanie u¿ytkowników.
Senior;
Mid;
Junior; 
Student; 

c) Ka¿dy Projekt posiada 1 tablicê kanban, z której mo¿e korzystaæ ka¿dy u¿ytkownik tego projektu.

d) Ka¿da tablica Kanban ma funkcjonalnoœæ "przeci¹gnij i upuœæ" w tym edycjê kolumn i zadañ, które mo¿e tworzyæ dowolny u¿ytkownik tego projektu.
3 domyœlne kolumny o nazwach : <b>ZADANIA</b> (TASKS) , <b>W TOKU</b> (IN PROGRES) i <b>ZROBIONE</b>.

e) Ka¿da kolumna tablicy Kanban bêdzie mieæ zadania (TASKI), które mo¿na przeci¹gaæ i przenosiæ, które mo¿e tworzyæ dowolny u¿ytkownik tego projektu, ale mog¹ byæ usuwane tylko przez u¿ytkownika z rang¹ "Manager" organizacji (który jest równie¿ kierownikiem projektów tej organizacji).

f) Ka¿de zadanie kolumny tablicy Kanban posiada atrybuty takie jak:
- Data rozpoczêcia, 
- Planowa data zakoñczenia/Datê zakoñczenia,
- Wa¿noœæ zadania od 1 do 5 oznaczane odpowiednim kolorem:
	- Zielony
	- Niebieski
	- ¯ó³ty
	- Pomarañczowy
	- Czerwony
<b> Wszyscy u¿ytkownicy projektu bêd¹ mogli zmieniæ kolor tylko swoich zadañ. </b>

Baza danych MySQL zawiera informacje o:
- u¿ytkownikach, 
- organizacjach, 
- projektach organizacji, 
- tablicach Kanban wewn¹trz projektów, 
- kolumnach wewn¹trz tablic Kanban
- zadaniach wewn¹trz kolumn 

2.3 Model komunikacji asychroniczny  

3. Harmonogram prac i zespó³ projektowy

Cz³onkowie zespo³u: 
- Magdalena Lipka aka Frog-Has-Curls, 
- Piotr Szulc aka OAH, 
- Oskar Gniewek aka pinholeye (<b>Tech-lead</b>).<br>

- 1.Inicjacja œrodowiska w NodeJS - Frog-Has-Curls 
	- Przygotowanie potrzebnych paczek  
- 2.Po¹czenie z serwerem - Frog-Has-Curls  
- 3.Pol¹czenie dockera - Frog-Has-Curls 
- 4.Implemntacja baz danych + docker - OAH
- 5.Inicjacja œrodowiska React - pinholeye
- 6.Kolumny i caly interface CSS - pinholeye 
- 7.Funcjonalnosci - pinholeye + OAH 
    - Logowanie uzytkownikow - OAH 
	- dodawanie/usuwanie taskow - pinholeye
	- drag and drop - pinholeye 
	- archiwizacja skonczonych taksow - pinholeye 
	- wa¿noœæ tasków - pinholeye

4. Analiza zagadnienia i jego modelowanie

5. Implementacja i testowanie

6. Podsumowanie

## Harmonogram prac i zespó³ projektowy start - 25.05


      
### Analiza zagadnienia i jego modelowanie
see branch
