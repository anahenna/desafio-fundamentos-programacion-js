$(document).ready(function () {

    const inputId = $("#inputId")
    const submitId = $("#submitId")
    const cardInfo = $("#cardInfo")
    const cardImage = $("#cardImage")
    const chartContainer = $("#chartContainer")
    let superheroData = [];



    function getSuperHeroData(superHeroId) {
        chartContainer.empty();
        $.ajax({
            url: `https://superheroapi.com/api.php/4905856019427443/${superHeroId}`,
            type: "GET",
            dataType: "json",
            success: function (data) {
                superheroData.push(data);

                const newArray = superheroData.map(function (hero) {
                    return {
                        url: hero.image.url,
                        name: hero.name,
                        connections: hero.connections["group-affiliation"],
                        publisher: hero.biography.publisher,
                        occupation: hero.work.occupation,
                        firstAppearance: hero.biography["first-appearance"],
                        height: hero.appearance.height[1],
                        weight: hero.appearance.weight[1],
                        aliases: hero.biography.aliases.join(', ')
                    };
                });
                newArray.forEach(({ url, name, connections, publisher, occupation, firstAppearance, height, weight, aliases }) => {
                    cardInfo.html('');
                    cardInfo.append(`
                    <div class="card">
                        <div class="row no-gutters">
                            <div id="cardImage" class="col-md-4 mt-5 mb-5">
                                <img id="cardImg" src="${url}" class="card-img" alt="Image">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">Nombre: ${name}</h5>
                                    <p class="card-text ">Conecciones: ${connections}</p>
                                    <p class="card-text border-bottom">Publicado por: ${publisher}</p>
                                    <p class="card-text border-bottom">Ocupación: ${occupation}</p>
                                    <p class="card-text border-bottom">Primera Aparición: ${firstAppearance}</p>
                                    <p class="card-text border-bottom">Altura: ${height}</p>
                                    <p class="card-text border-bottom">Peso: ${weight}</p>
                                    <p class="card-text border-bottom">Alianzas: ${aliases}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                        `);
                });

                const powerstats = data.powerstats;

                const dataPoints = [
                    { label: "Intelligence", y: Number(powerstats.intelligence) },
                    { label: "Strength", y: Number(powerstats.strength) },
                    { label: "Speed", y: Number(powerstats.speed) },
                    { label: "Durability", y: Number(powerstats.durability) },
                    { label: "Power", y: Number(powerstats.power) },
                    { label: "Combat", y: Number(powerstats.combat || 0) }
                ];

                const options = {
                    title: {
                        text: "Powerstats of " + data.name
                    },
                    data: [{
                        type: "pie",
                        startAngle: 45,
                        showInLegend: true,
                        legendText: "{label}",
                        indexLabel: "{label} ({y})",
                        yValueFormatString: "#,##0.#'%'",
                        dataPoints: dataPoints,
                    }]
                };
                const chart = new CanvasJS.Chart("chartContainer", options);
                chart.render();
                chartContainer.addClass('chart-container');
                CanvasJS.Chart.prototype.handleError = function (error) {
                    console.log("Error: ", error.message);
                };

            },
            error: function (e) {
                console.log(e);
            }
        });
    }

    function validateSuperHeroId(superHeroId) {
        if (superHeroId === "") {
            alert("Ingresa un número por favor.");
            return false;
        } else if (!$.isNumeric(superHeroId)) {
            alert("Por favor, ingresa solo números.");
            return false;
        }
        return true;
    }

    submitId.on("click", function (e) {
        e.preventDefault();

        const superHeroId = inputId.val().trim();

        if (validateSuperHeroId(superHeroId)) {
            getSuperHeroData(superHeroId);
        }
        inputId.val("");
    });
})