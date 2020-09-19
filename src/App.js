import React, {useState, useEffect} from 'react';
import './App.css';
import {MenuItem, Select, FormControl, Card, CardContent} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import {sortData} from "./Util";
import LineGraph from "./LineGraph";

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide')
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
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
        const a = await fetch(url)
            .then(response => response.json())
            .then(data => {
                setCountry(countryCode);
                setCountryInfo(data);
            })
        //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    };
    console.log(countryInfo);
    return (
        <div className="App">
            <div className={"app__left"}>
                <div className={"app__header"}>
                    <h1>COvid 19 Tracker</h1>
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
                    <InfoBox title={"CoronaVirus Cases"}
                             cases={countryInfo.todayCases}
                             total={countryInfo.cases}
                    />
                    <InfoBox title={" Recovered"}
                             cases={countryInfo.todayRecovered}
                             total={countryInfo.recovered}
                    />
                    <InfoBox title={"Deaths"}
                             cases={countryInfo.todayDeaths}
                             total={countryInfo.deaths}
                    />
                </div>
                {/*map*/}
                <Map/>

            </div>
            <Card className={"app__right"}>
                <CardContent>
                    <h3> live cases by country</h3>
                    <Table countries={tableData}/>

                    <h3> Worldwide new cases</h3>
                    <LineGraph/>
                </CardContent>
            </Card>

        </div>
    );
}

export default App;
