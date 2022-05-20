// use D3 to create connection between selDataset in HTML and JS script 
let dropdown = d3.select("#selDataset");


// Load data from samples.json file

d3.json("static/samples.json").then(data => {
    console.log(data)
    for (let i = 0; i < data["names"].length; i++) {
        let id = data["names"][i];
        dropdown
            .append("option")
            .text(id)
            .attr("value", id);
    }

    d3.select("option").property("selected", true);

    // Create a variable ID to hold the subject id for the plots

    id = dropdown.property('value')
    console.log(id)

    // make the variable change when the dropdown menu changes
    dropdown.on("click", () => {
        let id = dropdown.property("value");
        console.log(id);

        // start data collecting with the selected id

        // Selecting Data for bar chart - bubble chart

        let sample_data = data["samples"].filter(item => (item["id"] === id))[0];
        let out_ids = sample_data["otu_ids"];
        let values = sample_data["sample_values"];
        let labels = sample_data["otu_labels"];

        let topout = out_ids.slice(0, 10).map(ids => "OTU" + String(ids)).reverse();
        let topvalues = values.slice(0, 10).reverse();
        let toplabels = labels.slice(0, 10).reverse();

        console.log(topout);
        console.log(topvalues);
        console.log(toplabels);

        // Select METADATE VARIABLES FOR OUTPUT

        let meta_data = data["metadata"].filter(item => (item["id"] === parseInt(id)))[0];
        let ethnic = meta_data["ethnicity"];
        let sex = meta_data["gender"];
        let location = meta_data["location"];
        let age = meta_data["age"];
        let washes = meta_data["wfreq"]

        console.log(ethnic);
        console.log(sex);
        console.log(location);

        // create data and format for the output of the meta-data section in the index

        // link the sections and remove anything that is in the section everytime ID changes
        let person_data = d3.select("#sample-metadata");

        person_data.selectAll("*").remove();

        // add the values to each parragraph

        person_data.append("p").text("Ethnicity: " + ethnic);
        person_data.append("p").text("Gender: " + sex);
        person_data.append("p").text("Location: " + location);
        person_data.append("p").text("Age: " + age);

        // Define and link the bar chart

        let barchart = d3.select("#bar")

        barchart.selectAll("*").remove();


        // add reponsivE true for autoadjust
        let config = {
            responsive: true

        }

        //create Trace and Layout for bar chart 
        let barT = {
            x: topvalues,
            y: topout,
            type: "bar",
            orientation: "h",
            marker: {
                color: "#735178"
            },
            hovertext: toplabels,
        };

        let barL = {
            title: `Top 10 OTUS for patient #${id}`,
            xaxis: {
                title: "Values in Sample"
            },
            font: {
                color: "#735178"
            }
        };

        //PLOT!!!

        Plotly.newPlot("bar", [barT], barL, config);

        // Define and link the bubble chart

        let bubblechart = d3.select("#bubble")

        // clean data so that a new chart shows everytime id gets changed.
        bubblechart.selectAll("*").remove();

        // create trace and layout for bubble chart.
        let bubbleT = {
            x: out_ids,
            y: values,
            text: labels,
            mode: "markers",
            marker: {
                size: values,
                sizeref: 2 * Math.max(...values) / (90 ** 2),
                sizemode: "area",
                color: "#E5E0FF"
            },
        };

        let bubbleL = {
            title: `OTUs Present in Subject #${id}`,
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Values"
            },
            font: {
                color: "#735178"
            }
        };

        //PLOT!!!!!
        Plotly.newPlot("bubble", [bubbleT], bubbleL, config);

        // Link with Guage

        let gaugechart = d3.select("#gauge")

        // Delete values for gauge graph when the ID gets changed
        gaugechart.selectAll("*").remove();

        // Create trace and layout for the gauge chart
        let gaugeT = {
            type: "indicator",
            mode: "gauge",
            value: washes,
            color: " #E5E0FF",
            title: {
                text: "Wash Belly Button <br> Frequency"
            },
            gauge: {
                bar: {
                    thickness: 0.45,
                    color: "#E0FFF6"
                },
                axis: {
                    range: [null, 12],
                    tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    visible: true,
                    ticks: "inside"
                }
            }
        };

        let gaugeL = {
            margin: {
                l: 10,
                r: 10,
            },
            font: {
                color: "#735178"
            }
        }

        //PLOT!!!!
        Plotly.newPlot("gauge", [gaugeT], gaugeL, config)


    });




});