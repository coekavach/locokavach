$(document).ready(function() {
    function updateSummary(data) {
        const totalZones = new Set(data.map(item => item.Zone)).size;
        const totalSheds = new Set(data.map(item => item.Shed)).size;
        const totalTypes = new Set(data.map(item => item.Type)).size;

        $('#total-zones').text(`Total Zones: ${totalZones}`);
        $('#total-sheds').text(`Total Sheds: ${totalSheds}`);
        $('#total-types').text(`Total Types: ${totalTypes}`);
    }

    function populateFilters(data) {
        const zones = [...new Set(data.map(item => item.Zone))];
        const sheds = [...new Set(data.map(item => item.Shed))];
        const types = [...new Set(data.map(item => item.Type))];

        zones.forEach(zone => {
            $('#zone-filter').append(new Option(zone, zone));
        });

        sheds.forEach(shed => {
            $('#shed-filter').append(new Option(shed, shed));
        });

        types.forEach(type => {
            $('#type-filter').append(new Option(type, type));
        });
    }

    function updateTable(data) {
        const tbody = $('#locomotive-table tbody');
        tbody.empty();

        data.forEach(item => {
            tbody.append(`
                <tr>
                    <td>${item.Zone}</td>
                    <td>${item['Loco Number']}</td>
                    <td>${item.Make}</td>
                    <td>${item.Shed}</td>
                    <td>${item.Type}</td>
                </tr>
            `);
        });
    }

    function applyFilters(data) {
        const selectedZone = $('#zone-filter').val();
        const selectedShed = $('#shed-filter').val();
        const selectedType = $('#type-filter').val();

        const filteredData = data.filter(item => {
            return (selectedZone === "" || item.Zone === selectedZone) &&
                   (selectedShed === "" || item.Shed === selectedShed) &&
                   (selectedType === "" || item.Type === selectedType);
        });

        updateTable(filteredData);
    }

    $('#zone-filter, #shed-filter, #type-filter').change(function() {
        applyFilters(window.locomotiveData);
    });

    // Load and parse CSV file
    Papa.parse("data.csv", {
        download: true,
        header: true,
        complete: function(results) {
            window.locomotiveData = results.data;

            updateSummary(window.locomotiveData);
            populateFilters(window.locomotiveData);
            updateTable(window.locomotiveData);
        }
    });
});
