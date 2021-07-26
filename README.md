## Projekt

Nazwa projektu: <b> �Snap it out� </b><br>


## 1.Problem biznesowy: Zarz�dzanie projektami w firmie 

Snap It Out jest aplikacj� pozwalaj�c� zarz�dza� zadaniami za pomoc� tablic. Umo�liwia zalogowanie si� oraz rozporz�dzanie zadaniami w obr�bie organizacji oraz projekt�w dla u�ytkownik�w w zale�no�ci od ich uprawnie�. Za pomoc� tablic mo�liwe jest systematyzowanie zada� oraz przypisywanie ich do u�ytkownik�w oraz etap�w pracy. 
Aplikacja ma na celu ukazywa� prosty i przejrzysty spos�b planowania, rozdzia�u oraz kontroli zada�. Pozwala na utworzenie i zarz�dzanie projektami w obr�bie organizacji, widoczny podzia� etap�w projektu, a tak�e przypisanie poszczeg�lnych zada� do u�ytkownik�w. 
Zaproponowana aplikacja jest tylko elementem postawionego problemu biznesowego, kt�ry ma za zadanie uzupe�nia� obran� strategi� zarz�dzania organizacj�.


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
+w�a�ciwo�ci
- zdecentralizowany request i send  


2.1 Model Architektury
Architektura Model-View-Controller  
	
2.2 Funkcjonalnosci   

Funkcje
- Bezpieczny system uwierzytelniania, aby umo�liwi� u�ytkownikom logowanie si� do aplikacji przy u�yciu adresu e-mail/nazwy u�ytkownika i has�a.
- Typy u�ytkownik�w cechuj� si� r�nymi uprawnieniami. Podgrupy dost�pne dla <b>Snap It Out</b> to�:
<b>Admin</b> - uprawnienia do zarz�dzania u�ytkownikami oraz organizacjami - og�lne zarz�dz�dzanie dostepem, tworzenie oraz usuwanie kont w tym przypisywanie do konkretnych organizacji, zmiana typu u�ytkownik�w (zmiana roli) oraz edycja szczeg��w organizacji.
<b>Manager</b> - uprawnienia do zarz�rzania u�ytkownikami i projektami w obr�bie w�asnej organizacji. Odpowiada za pe�ny nadz�r nad projektami wewn�trz organizacji w tym tworzenie, edycja czy przypisywanie u�ytkownik�w.
Senior;
Mid;
Junior; 
Student; 

c) Ka�dy Projekt posiada 1 tablic� kanban, z kt�rej mo�e korzysta� ka�dy u�ytkownik tego projektu.

d) Ka�da tablica Kanban ma funkcjonalno�� "przeci�gnij i upu��" w tym edycj� kolumn i zada�, kt�re mo�e tworzy� dowolny u�ytkownik tego projektu.
3 domy�lne kolumny o nazwach : <b>ZADANIA</b> (TASKS) , <b>W TOKU</b> (IN PROGRES) i <b>ZROBIONE</b>.

e) Ka�da kolumna tablicy Kanban b�dzie mie� zadania (TASKI), kt�re mo�na przeci�ga� i przenosi�, kt�re mo�e tworzy� dowolny u�ytkownik tego projektu, ale mog� by� usuwane tylko przez u�ytkownika z rang� "Manager" organizacji (kt�ry jest r�wnie� kierownikiem projekt�w tej organizacji).

f) Ka�de zadanie kolumny tablicy Kanban posiada atrybuty takie jak:
- Data rozpocz�cia, 
- Planowa data zako�czenia/Dat� zako�czenia,
- Wa�no�� zadania od 1 do 5 oznaczane odpowiednim kolorem:
	- Zielony
	- Niebieski
	- ��ty
	- Pomara�czowy
	- Czerwony
<b> Wszyscy u�ytkownicy projektu b�d� mogli zmieni� kolor tylko swoich zada�. </b>

Baza danych MySQL zawiera informacje o:
- u�ytkownikach, 
- organizacjach, 
- projektach organizacji, 
- tablicach Kanban wewn�trz projekt�w, 
- kolumnach wewn�trz tablic Kanban
- zadaniach wewn�trz kolumn 

2.3 Model komunikacji asychroniczny  

3. Harmonogram prac i zesp� projektowy

Cz�onkowie zespo�u: 
- Magdalena Lipka aka Frog-Has-Curls, 
- Piotr Szulc aka OAH, 
- Oskar Gniewek aka pinholeye (<b>Tech-lead</b>).<br>

- 1.Inicjacja �rodowiska w NodeJS - Frog-Has-Curls 
	- Przygotowanie potrzebnych paczek  
- 2.Po�czenie z serwerem - Frog-Has-Curls  
- 3.Pol�czenie dockera - Frog-Has-Curls 
- 4.Implemntacja baz danych + docker - OAH
- 5.Inicjacja �rodowiska React - pinholeye
- 6.Kolumny i caly interface CSS - pinholeye 
- 7.Funcjonalnosci - pinholeye + OAH 
    - Logowanie uzytkownikow - OAH 
	- dodawanie/usuwanie taskow - pinholeye
	- drag and drop - pinholeye 
	- archiwizacja skonczonych taksow - pinholeye 
	- wa�no�� task�w - pinholeye

4. Analiza zagadnienia i jego modelowanie

5. Implementacja i testowanie

6. Podsumowanie

## Harmonogram prac i zesp� projektowy start - 25.05


      
### Analiza zagadnienia i jego modelowanie
see branch
