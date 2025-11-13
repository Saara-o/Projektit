const hakukentta = document.querySelector(".hakukentta");

// Oletuksena haetaan kirjan nimen mukaan
let hakutyyppi = "title";

// Lisätään toiminnallisuus painikkeisiin
function setHakutyyppi(tyyppi) {
    hakutyyppi = tyyppi;

    // Poistetaan active-luokka hakutyyppi-painikkeilta
    let buttons = document.querySelectorAll(".hakutyyppiBtn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }

    // Lisätään active-luokka valituun painikkeeseen
    let button = document.getElementById(tyyppi + "Btn");
    if (button) {
        button.classList.add("active");
    }
}


// Lisätään kuuntelija hakukenttään
hakukentta.addEventListener("keypress", clickEnter);

// Enter-näppäimen painalluksesta submit
function clickEnter (e) {
    // Tarkistetaan, että on painettu Enter-näppäintä
    if (e.key === "Enter") {
        e.preventDefault(); // Estetään lomakkeen oletustoiminta
        const pituus = hakukentta.value.length;
        const hakusana = hakukentta.value.trim();

        // Hakukentän tarkastus
        if (pituus === 0) {
        alert("Hakukenttä on tyhjä.")
        hakukentta.disabled = true;
        return;
    }
        // Jos kenttä ei ole tyhjä
        haeData(hakusana);
    }
}

// Luodaan AJAX-olio
function haeData (hakusana) {
    // Luodaan URL, jossa on käyttäjän syöte otettu huomioon (title tai author)
    let url = "https://openlibrary.org/search.json?" + hakutyyppi + "=" + encodeURIComponent(hakusana);
    let xhr = new XMLHttpRequest();
    // Kerrotaan mihin osoitteeseen tietopyyntö lähtee
    xhr.open("GET", url, true);
    //Määritellään käsittelijä vastauksen saapuessa
    xhr.onreadystatechange = function () {
        // Jos ei ole tullut virheitä matkalla
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Muutetaan vastaus JSON-muotoon
            let data = JSON.parse(xhr.responseText);
            // Tarkistetaan löytyikö yhtään tulosta
            if (data.docs.length === 0) {
                document.getElementById("tulokset").innerText =
                "Hakusanalla ei löytynyt yhtään kirjaa. Kokeile toista hakusanaa."
                return;
            }
            // Oma funktio käsittelee haetun datan
            parsiData(data);
        } 
        // Mikäli on tullut virheitä
        else if (xhr.status === 403) {
            document.getElementById("tulokset").innerText =
            "Haussa tapahtui virhe: palvelin esti haun (403). Tarkista hakutyyppi tai kokeile myöhemmin uudelleen.";
        }
        else if (xhr.status === 404) {
            document.getElementById("tulokset").innerText =
            "Haussa tapahtui virhe: kirjaa ei löytynyt (404). Kokeile toista hakusanaa.";
        }
    };
    // Lähetetään edellä muovattu AJAX-olio
    xhr.send();
}
// Datan käsittelevä funktio
function parsiData(data) {
    // Luodaan muuttuja, johon tulokset kootaan
    let rivit = "";

    // Luodaan silmukka joka käy läpi kaikki tulostusrivit
    for (let i = 0; i < data.docs.length; i++) {
        rivit += `<tr>
                    <td>${data.docs[i].title}</td>
                    <td>${data.docs[i].author_name}</td>
                    <td>${data.docs[i].first_publish_year}</td>
                    <td>${data.docs[i].language}</td>
                </tr>`;
    }

    // Rakennetaan taulu tuloksille
    const taulu = `
        <table class = "kirjataulu">
            <thead>
                <tr>
                    <th>Kirjan nimi</th>
                    <th>Tekijä</th>
                    <th>Julkaisuvuosi</th>
                    <th>Kielet</th>
                </tr>
            </thead>
            <tbody>
                ${rivit}
            </tbody>
        </table>
    `;

    // Sijoitetaan tulokset nimiseen div-elementtiin
    document.querySelector("#tulokset").innerHTML = taulu;
}