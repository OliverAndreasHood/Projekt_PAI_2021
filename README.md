# Projekt_PAI_2021

## Skład zespołu:
- Piotr Szulc
- Magdalena Lipka
- Oskar Gniewek

## Rozpatrujemy dwie opcje:

1. Kanban Chart
2. CryptoCurrency Vault

## Terminarz:
- [x] 04.05 -> Zgłoszenie zespołów 
- [x] 10.05 -> Pierwszy draft projektu (podpunkt 5: a i b) 
- [ ] 24.05 -> Drugi draft projektu (podpunkt 5: c i d) 
- [ ] 07.06! -> Wstawienie na GitHub wstępnych implementacji projektu 
- [ ] 30.06 -> Zakończenie prac nad aplikacją i prezentacja wyników


##Project

Nazwa projektu: “Snap it out (SiO2)” <br>
Członkowie zespołu: Magdalena Lipka, Piotr Szulc, Oskar Gniewek <br>
Tech-lead: Oskar Gniewek aka pinholeye <br>

1.Problem biznesowy: Zarządzanie projektami w firmie

Problem biznesowy opiera się o zarządzaniu projektami w firmie. Celem jest stworzenie platformy, która będzie narzędziem do zarządzania projektami dla wielu klientów (firm) w formie strategii kanban

2.Wymagania systemowe i funcjonalne

Import potrzebnych bibliotek:
- SQL (MySQL)
- React 
- JS
- Recharts (wykresy)
-math
-random

Serwer
Postawienie serwera w node.js na AWS

Baza Danych
Stworzenie bazy danych w node
Struktura:
tabela ze wszystkimi organizacjami -> tabela projektow -> tabela poejdynczygo (sprzezone tabele)
zdecentralizowane:
tabela czlonkowie/pracownicy projektow + przypisane projekty/organizacje +właściwości
zdecentralizowany request i send
Funkcjonalności:
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

Podstrony:
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



 Harmonogram prac i zespół projektowy start - 25.05

1.Inicjacja środowiska w NodeJS - Magda - 3 dni
	Pobranie potrzebnych paczek
2.Poączenie z serwerem - Magda - tydzień
3.Polączenie dockera - Magda - tydzień
4.Implemntacja baz danych + docker - Piotr - 3 dni
5.Inicjacja środowiska React - Oskar - 3 dni
6.Kolumny i caly interface CSS - Oskar - tydzien 
7.Funcjonalnosci - Oskar + Piotr - 20 dni
	Logowanie uzytkownikow - Piotr - 4 dni
	dodawanie/usuwanie taskow - Oskar - 3 dni
	drag and drop - Oskar - tydzien
	archiwizacja skonczonych taksow - Oskar - 4 dni
	ważność tasków - Oskar - 3 dni

d. Analiza zagadnienia i jego modelowanie

Baza danych

Nazwa	PK =	Primary Key				
Kolumny	U =	Unique				
Typy	N=	Null				
Users DB (USER)						
User_ID (PK)	Name (U)	Password	Alias (U)	Country (N)	Register	
INT 11	VARCHAR 255	VARCHAR 255	VARCHAR 6	VARCHAR 255	DATE	
						
Fields DB (FIELDS)						
Field_ID (PK)	Name	Alias (U)				
INT 11	VARCHAR 255	VARCHAR 4				
						
Fields-User (MID1)						
ID (PK)	User	Field				
INT 11	User_ID	Field_ID				
						
Organisation DB (ORG)						
Org_ID (PK)	Name (U)	Leader	Description (N)	Private	Register	
INT 11	VARCHAR 255	User_ID	VARCHAR 5000	BOOLEAN	DATE	
						
Org-Users (MID2)						
ID (PK)	Org	User				
INT 11	Org_ID	User_ID				
						
Projects DB (PROJ)						
Proj_ID (PK)	Name (U)	Organisation	P_Leader	Description (N)	Private	Create_date
INT 11	VARCHAR 255	Org_ID	User_ID	VARCHAR 5000	BOOLEAN	DATE
						
Proj-Users (MID3)						
ID (PK)	Proj	User				
INT 11	Proj_ID	User_ID				
						
Charts DB (CHART)						
Chart_ID (PK)	Name	Project	C_Leader	Description (N)	Private	
INT 11	VARCHAR 255	Proj_ID	User_ID	VARCHAR 5000	BOOLEAN	
						
Chart-User (MID4)						
ID (PK)	Chart	User				
INT 11	Chart_ID	User_ID				
						
Columns DB (COL)						
Col_ID (PK)	Name	Chart	Archive	Position		
INT 11	VARCHAR 50	Chart_ID	BOOLEAN	Int		
						
Notes DB (NOTE)						
Note_ID (PK)	Title	Column (U)	Field	Color	Owner	Description (N)
INT 11	VARCHAR 50	Col_ID	Field_ID	#[HEX] (Int?)	User_ID	VARCHAR 5000
						
c.d.->	Date_Start	Date_End	Urgent	Done	Archive	
c.d.->	DATE	DATE	BOOLEAN	BOOLEAN	BOOLEAN	
						
						
Note-User (MID5)						
ID (PK)	Note	User				
INT 11	Note_ID	User_ID	

