import { $ } from "./helpers.js";

export async function popularSelect({
    url,
    selectId,
    valueKey = "descricao",
    textKey = "descricao",
    addDefault = false,
    defaultText = "",
    filterFn = null,
    sortFn = null
}) {


    try {
        const response = await fetch(url);

        let dados = await response.json();

        if (filterFn) dados = dados.filter(filterFn);
        if (sortFn) dados.sort(sortFn);

        const select = document.getElementById(selectId);

        if (!select) {
            console.warn("Select não encontrado:", selectId);
            return;
        }

        select.innerHTML = "";

        if (addDefault) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = defaultText;
            select.appendChild(option);
        }

        dados.forEach(item => {
            const option = document.createElement("option");
            option.value = item[valueKey] ?? "";
            option.textContent = item[textKey] ?? "";
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar:", url, error);
    }
}