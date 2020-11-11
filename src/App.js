import React, {useState, useEffect} from 'react';
import './App.css';
import {MenuItem, Select, FormControl, Card, CardContent} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import {sortData, prettyPrintStat} from "./Util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import VideoPlay from "./videoplay";

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide')
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState("cases")
    // STATE = how to write a variabale in REact

    // https://disease.sh/v3/covid-19/coutries

    //USEEFFECT = runs a piece of code
    // based on a given condition


    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    useEffect(() => {
        // the code inside here will run once
        // when the component loads and not again
        // async -> send a request, wait for it, do something with it
        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    //
                    const countries = data.map((country) => ({
                            name: country.country, // united State, United Kingdom
                            value: country.countryInfo.iso2 // UK, USA, FR
                        }
                    ));
                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setMapCountries(data);
                    setCountries(countries);
                })
        }
        getCountriesData();
    }, [])

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        setCountry(countryCode);
        const url = countryCode === "worldwide"
            ? "https://disease.sh/v3/covid-19/all"
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setCountry(countryCode);
                setCountryInfo(data);
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            })
        //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    };
    console.log(countryInfo);
    return (
        <div className="App">
            <div className={"app__left"}>
                <div className={"app__header"}>
                    <h1>Covid 19 Tracker</h1>
                    <h2>AnhHD X HoangAnh Vu</h2>
                    <FormControl className={"app_dropdown"}>
                        <Select
                            variant={"outlined"}
                            onChange={onCountryChange}
                            value={country}>
                            {/*loop through all the countries and show a drop down list of the options*/}
                            <MenuItem value={"worldwide"}>Worldwide</MenuItem>

                            {
                                countries.map((country) => (
                                    <MenuItem value={country.value}>{country.name} </MenuItem>
                                ))
                            }

                        </Select>
                    </FormControl>
                </div>
                <div className={"app__stats"}>
                    <InfoBox
                        isRed
                        active={casesType === "cases"}
                        title={"CoronaVirus Cases"}
                        onClick={e => setCasesType('cases')}
                        cases={prettyPrintStat(countryInfo.todayCases)}
                        total={prettyPrintStat(countryInfo.cases)}
                    />
                    <InfoBox
                        active={casesType === "recovered"}
                        title={" Recovered"}
                        onClick={e => setCasesType('recovered')}
                        cases={prettyPrintStat(countryInfo.todayRecovered)}
                        total={prettyPrintStat(countryInfo.recovered)}
                    />
                    <InfoBox
                        isRed
                        active={casesType === "deaths"}
                        title={"Deaths"}
                        onClick={e => setCasesType('deaths')}
                        cases={prettyPrintStat(countryInfo.todayDeaths)}
                        total={prettyPrintStat(countryInfo.deaths)}
                    />
                </div>
                {/*map*/}
                <Map
                    casesType={casesType}
                    countries={mapCountries}
                    center={mapCenter}
                    zoom={mapZoom}/>
                <VideoPlay/>

            </div>
            <Card className={"app__right"}>
                <CardContent>
                    <h3> live cases by country</h3>
                    <Table countries={tableData}/>

                    <h3 className={"app__graphTitle"}> Worldwide new {casesType}</h3>
                    <LineGraph className={"app__graph"} casesType={casesType}/>
                </CardContent>
                <h4>Data from <a href={"http://disease.sh/"}><h4>disease.sh</h4></a></h4>

            </Card>
        </div>
    );
}

export default App;
