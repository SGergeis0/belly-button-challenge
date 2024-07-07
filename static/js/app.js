// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;
    

    // Filter the metadata for the object with the desired sample number
    const selectedMetadata = metadata.find(item => item.id === +sample);
    

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");


    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples

    // Filter the samples for the object with the desired sample number
    const sampleArray = samples.filter(sample => sample.id == sample);
    const sample1 = sampleArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = sample1.otu_ids
    const sample_values = sample1.sample_values
    const otu_labels = sample1.otu_labels

    // Build a Bar Chart
   const trace1 = [
    {
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(otu_id => "OTU "+otu_id).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h" }
   ];
  let layout = {
    title:"top 10 OTUs"
  };
  Plotly.newPlot("bar", trace1, layout)

    });

};
// Build bubble plot
function buildBubblePlot(sampleID) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    const samples = data.samples;

    const sampleArray = samples.filter(sample => sample.id == sampleID);
    if (sampleArray.length > 0) {
      const sample = sampleArray[0];

      // Assign variable names
      const otu_ids = sample.otu_ids;
      const sample_values = sample.sample_values;
      const otu_labels = sample.otu_labels;

      const trace2 = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ];

      const layout2 = {
        xaxis: { title: "OTU ID" }
      };

      // Render the Bubble plot
      Plotly.newPlot("bubble", trace2, layout2);
    } else {
      console.log("No sample found for the given sampleID");
    }
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
  const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
  const dropdown = d3.select("#selDataset");
  names.forEach((name) => {
    dropdown.append("option").text(name).property("value", name);
  });

    // Use the list of sample names to populate the select options
  const firstSample = names[0];

    // Build charts and metadata panel with the first sample
  buildCharts(firstSample);
  buildMetadata(firstSample);
  buildBubblePlot(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
buildBubblePlot(newSample);
}
// Initialize the dashboard
init();
